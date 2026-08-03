import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import type { TransactionDTO } from "@/types/transaction";

export async function GET(request: NextRequest) {
  const invoiceId = request.nextUrl.searchParams.get("invoiceId");
  if (!invoiceId) {
    return apiError("invoiceId wajib diisi", 422);
  }

  const trx = await prisma.transaction.findUnique({
    where: { invoiceId },
    include: { product: { include: { game: true } } },
  });

  if (!trx) {
    return apiError("Transaksi tidak ditemukan. Periksa kembali nomor invoice kamu.", 404);
  }

  const data: TransactionDTO = {
    id: trx.id,
    invoiceId: trx.invoiceId,
    gameAccount: trx.gameAccount as Record<string, string>,
    amount: trx.amount,
    paymentMethod: trx.paymentMethod,
    paymentRef: trx.paymentRef,
    paymentUrl: trx.paymentUrl,
    vipaymentRef: trx.vipaymentRef,
    status: trx.status,
    paidAt: trx.paidAt?.toISOString() ?? null,
    processedAt: trx.processedAt?.toISOString() ?? null,
    completedAt: trx.completedAt?.toISOString() ?? null,
    failedReason: trx.failedReason,
    createdAt: trx.createdAt.toISOString(),
    product: {
      id: trx.product.id,
      name: trx.product.name,
      sellPrice: trx.product.sellPrice,
      game: {
        id: trx.product.game.id,
        name: trx.product.game.name,
        slug: trx.product.game.slug,
        image: trx.product.game.image,
      },
    },
  };

  return apiOk(data);
}
