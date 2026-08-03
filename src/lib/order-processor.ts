import { prisma } from "@/lib/prisma";
import { vipayment, VIPaymentError } from "@/lib/vipayment";
import { retryWithBackoff } from "@/lib/retry";

/**
 * Pushes a PAID transaction to VIPayment for fulfillment. Called right after
 * a payment gateway callback marks a transaction PAID, and reusable for
 * admin "retry failed transaction" actions.
 *
 * PAID -> PROCESSING -> SUCCESS | FAILED (or stays PROCESSING if VIPayment's
 * own order is still pending — the VIPayment webhook at
 * /api/transaction/callback finalizes that case later).
 */
export async function processVipaymentOrder(transactionId: string) {
  const trx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { product: true },
  });

  if (!trx) throw new Error("Transaksi tidak ditemukan");
  if (trx.status !== "PAID" && trx.status !== "PROCESSING") return trx;

  await prisma.transaction.update({
    where: { id: trx.id },
    data: { status: "PROCESSING", processedAt: trx.processedAt ?? new Date() },
  });

  const account = trx.gameAccount as Record<string, string>;
  const target = account.zoneId ? `${account.userId} ${account.zoneId}` : (account.userId ?? account.email ?? "");

  try {
    if (!vipayment.isConfigured()) {
      throw new VIPaymentError("VIPayment belum dikonfigurasi (VIPAYMENT_API_KEY/VIPAYMENT_API_ID kosong)");
    }

    const result = await retryWithBackoff(() => vipayment.createOrder(trx.product.sku, target), {
      retries: 3,
      baseDelayMs: 500,
    });

    if (result.status === "success") {
      return await prisma.transaction.update({
        where: { id: trx.id },
        data: { status: "SUCCESS", completedAt: new Date(), vipaymentRef: result.trxid },
      });
    }

    if (result.status === "error") {
      return await prisma.transaction.update({
        where: { id: trx.id },
        data: { status: "FAILED", failedReason: result.message, vipaymentRef: result.trxid },
      });
    }

    // "pending" / "processing" on VIPayment's side — wait for their webhook.
    return await prisma.transaction.update({
      where: { id: trx.id },
      data: { vipaymentRef: result.trxid },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memproses pesanan ke VIPayment";
    return await prisma.transaction.update({
      where: { id: trx.id },
      data: { status: "FAILED", failedReason: message },
    });
  }
}
