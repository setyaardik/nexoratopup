import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { tripay, PaymentError } from "@/lib/payment";

const depositSchema = z.object({
  amount: z.number().int().min(10_000, "Minimal deposit Rp10.000").max(50_000_000),
  method: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return apiError("Masuk terlebih dahulu", 401);

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`deposit-create:${session.user.id}:${ip}`, 10, 5 * 60 * 1000);
  if (!allowed) return apiError("Terlalu banyak permintaan, coba lagi nanti", 429);

  const body = await request.json().catch(() => null);
  const parsed = depositSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);

  const { amount, method } = parsed.data;

  const deposit = await prisma.deposit.create({
    data: { userId: session.user.id, amount, method, status: "PENDING" },
  });

  try {
    const result = await tripay.createTransaction({
      method,
      merchantRef: `DEP-${deposit.id}`,
      amount,
      customerName: session.user.name ?? "NEXORA Member",
      customerEmail: session.user.email ?? "",
      orderItems: [{ sku: "DEPOSIT", name: "Deposit Saldo NEXORA", price: amount, quantity: 1 }],
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/payment/callback`,
      returnUrl: `${process.env.NEXTAUTH_URL}/dashboard/deposit`,
    });

    await prisma.deposit.update({ where: { id: deposit.id }, data: { paymentRef: result.reference } });

    return apiOk({ paymentUrl: result.checkout_url }, "Deposit dibuat, lanjutkan pembayaran", 201);
  } catch (error) {
    await prisma.deposit.update({ where: { id: deposit.id }, data: { status: "FAILED" } });
    if (error instanceof PaymentError) {
      return apiError(`Gateway pembayaran belum tersedia: ${error.message}`, 503);
    }
    console.error("Failed to create deposit payment", error);
    return apiError("Gagal membuat transaksi deposit", 500);
  }
}
