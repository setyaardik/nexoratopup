import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiOk, apiError } from "@/lib/api-response";
import { processVipaymentOrder } from "@/lib/order-processor";
import { prisma } from "@/lib/prisma";

/**
 * Manually (re)push a transaction to VIPayment. Used by the admin panel to
 * retry a FAILED transaction, or a PAID one stuck before processing.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return apiError("Tidak diizinkan", 403);
  }

  const body = await request.json().catch(() => null);
  const transactionId = body?.transactionId as string | undefined;
  if (!transactionId) {
    return apiError("transactionId wajib diisi", 422);
  }

  const trx = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!trx) return apiError("Transaksi tidak ditemukan", 404);

  if (trx.status === "FAILED") {
    await prisma.transaction.update({ where: { id: trx.id }, data: { status: "PAID", failedReason: null } });
  } else if (trx.status !== "PAID" && trx.status !== "PROCESSING") {
    return apiError("Transaksi ini belum dibayar, tidak bisa diproses ke VIPayment", 400);
  }

  const updated = await processVipaymentOrder(trx.id);
  return apiOk(updated, "Pesanan diproses ulang");
}
