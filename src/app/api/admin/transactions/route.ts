import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/guards";

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession())) return apiError("Tidak diizinkan", 403);

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Number(searchParams.get("pageSize")) || 20);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const where = {
    ...(status && status !== "all" ? { status: status as never } : {}),
    ...(q ? { invoiceId: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { product: { include: { game: true } }, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return apiOk({ transactions, total, page, pageSize });
}

const patchSchema = z.object({
  transactionId: z.string().min(1),
  action: z.enum(["refund"]),
});

export async function PATCH(request: NextRequest) {
  if (!(await requireAdminSession())) return apiError("Tidak diizinkan", 403);

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);

  const trx = await prisma.transaction.findUnique({ where: { id: parsed.data.transactionId } });
  if (!trx) return apiError("Transaksi tidak ditemukan", 404);
  if (trx.status === "REFUNDED") return apiError("Transaksi sudah direfund", 400);

  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({ where: { id: trx.id }, data: { status: "REFUNDED" } });
    if (trx.paymentMethod === "saldo" && trx.userId) {
      await tx.user.update({ where: { id: trx.userId }, data: { balance: { increment: trx.amount } } });
    }
  });

  return apiOk(null, "Transaksi berhasil direfund");
}
