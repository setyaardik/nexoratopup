import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { processVipaymentOrder } from "@/lib/order-processor";

/**
 * Dev-only helper to simulate a Tripay payment callback without needing a
 * real Tripay account/signature. Disabled outside development so it can
 * never be hit in production.
 *
 * POST { "merchantRef": "INV-..." | "DEP-...", "status": "PAID" | "EXPIRED" | "FAILED" }
 */
const testSchema = z.object({
  merchantRef: z.string().min(1),
  status: z.enum(["PAID", "EXPIRED", "FAILED"]).default("PAID"),
});

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return apiError("Not found", 404);
  }

  const body = await request.json().catch(() => null);
  const parsed = testSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);
  }
  const { merchantRef, status } = parsed.data;

  if (merchantRef.startsWith("DEP-")) {
    const depositId = merchantRef.replace(/^DEP-/, "");
    const deposit = await prisma.deposit.findUnique({ where: { id: depositId } });
    if (!deposit) return apiError("Deposit tidak ditemukan", 404);
    if (deposit.status !== "PENDING") return apiError(`Deposit sudah berstatus ${deposit.status}`, 400);

    if (status === "PAID") {
      await prisma.$transaction([
        prisma.deposit.update({ where: { id: deposit.id }, data: { status: "SUCCESS" } }),
        prisma.user.update({ where: { id: deposit.userId }, data: { balance: { increment: deposit.amount } } }),
      ]);
    } else {
      await prisma.deposit.update({ where: { id: deposit.id }, data: { status: "FAILED" } });
    }
    const updated = await prisma.deposit.findUnique({ where: { id: deposit.id } });
    return apiOk(updated, "Simulasi callback deposit berhasil");
  }

  const trx = await prisma.transaction.findUnique({ where: { invoiceId: merchantRef } });
  if (!trx) return apiError("Transaksi tidak ditemukan", 404);
  if (trx.status !== "PENDING") return apiError(`Transaksi sudah berstatus ${trx.status}`, 400);

  if (status === "PAID") {
    await prisma.transaction.update({
      where: { id: trx.id },
      data: { status: "PAID", paidAt: new Date(), paymentRef: `TEST-${trx.invoiceId}` },
    });
    await processVipaymentOrder(trx.id);
  } else {
    await prisma.transaction.update({ where: { id: trx.id }, data: { status } });
  }

  const updated = await prisma.transaction.findUnique({ where: { id: trx.id } });
  return apiOk(updated, "Simulasi callback berhasil");
}
