import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { tripay } from "@/lib/payment";
import { apiOk, apiError } from "@/lib/api-response";
import { processVipaymentOrder } from "@/lib/order-processor";
import type { TripayCallbackPayload } from "@/types/payment";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-callback-signature");

  if (!tripay.verifyCallbackSignature(rawBody, signature)) {
    return apiError("Signature tidak valid", 401);
  }

  let payload: TripayCallbackPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return apiError("Payload tidak valid", 400);
  }

  if (payload.merchant_ref.startsWith("DEP-")) {
    return handleDepositCallback(payload);
  }
  return handleTransactionCallback(payload);
}

async function handleTransactionCallback(payload: TripayCallbackPayload) {
  const trx = await prisma.transaction.findUnique({ where: { invoiceId: payload.merchant_ref } });
  if (!trx) return apiError("Transaksi tidak ditemukan", 404);

  if (trx.status === "PENDING") {
    if (payload.status === "PAID") {
      await prisma.transaction.update({
        where: { id: trx.id },
        data: { status: "PAID", paidAt: new Date(), paymentRef: payload.reference },
      });
      processVipaymentOrder(trx.id).catch((err) => console.error("VIPayment order processing failed", err));
    } else if (payload.status === "EXPIRED") {
      await prisma.transaction.update({ where: { id: trx.id }, data: { status: "EXPIRED" } });
    } else if (payload.status === "FAILED") {
      await prisma.transaction.update({
        where: { id: trx.id },
        data: { status: "FAILED", failedReason: "Pembayaran gagal di gateway" },
      });
    }
  }

  return apiOk(null, "OK");
}

async function handleDepositCallback(payload: TripayCallbackPayload) {
  const depositId = payload.merchant_ref.replace(/^DEP-/, "");
  const deposit = await prisma.deposit.findUnique({ where: { id: depositId } });
  if (!deposit) return apiError("Deposit tidak ditemukan", 404);

  if (deposit.status === "PENDING") {
    if (payload.status === "PAID") {
      await prisma.$transaction([
        prisma.deposit.update({ where: { id: deposit.id }, data: { status: "SUCCESS" } }),
        prisma.user.update({ where: { id: deposit.userId }, data: { balance: { increment: deposit.amount } } }),
      ]);
    } else if (payload.status === "EXPIRED" || payload.status === "FAILED") {
      await prisma.deposit.update({ where: { id: deposit.id }, data: { status: "FAILED" } });
    }
  }

  return apiOk(null, "OK");
}
