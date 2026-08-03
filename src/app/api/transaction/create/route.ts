import { NextRequest } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getEffectivePrice } from "@/lib/pricing";
import { tripay, PaymentError } from "@/lib/payment";
import { processVipaymentOrder } from "@/lib/order-processor";
import { generateInvoiceId } from "@/lib/utils";
import type { GameField } from "@/types/game";

const createTransactionSchema = z.object({
  productId: z.string().min(1),
  gameAccount: z.record(z.string(), z.string()),
  paymentMethod: z.string().min(1),
  customerName: z.string().min(2).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterMs } = checkRateLimit(`txn-create:${ip}`, 10, 5 * 60 * 1000);
  if (!allowed) {
    return apiError(`Terlalu banyak permintaan. Coba lagi dalam ${Math.ceil(retryAfterMs / 1000)} detik.`, 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = createTransactionSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);
  }

  const { productId, gameAccount, paymentMethod, customerPhone } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    include: { game: true },
  });
  if (!product || !product.game.isActive) {
    return apiError("Produk tidak ditemukan atau sedang tidak tersedia", 404);
  }

  const requiredFields = (product.game.fields as unknown as GameField[]).filter((f) => f.required);
  for (const field of requiredFields) {
    if (!gameAccount[field.name]?.trim()) {
      return apiError(`${field.label} wajib diisi`, 422);
    }
  }

  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "MEMBER";
  const amount = getEffectivePrice(product, role);

  const customerName = parsed.data.customerName ?? session?.user?.name ?? undefined;
  const customerEmail = parsed.data.customerEmail ?? session?.user?.email ?? undefined;
  if (!customerName || !customerEmail) {
    return apiError("Nama dan email pemesan wajib diisi", 422);
  }

  const invoiceId = generateInvoiceId();

  // Pay with NEXORA wallet balance — no payment gateway involved, settles immediately.
  if (paymentMethod === "saldo") {
    if (!session?.user) {
      return apiError("Masuk terlebih dahulu untuk membayar dengan saldo NEXORA", 401);
    }
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.balance < amount) {
      return apiError("Saldo NEXORA tidak mencukupi", 400);
    }

    const trx = await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { balance: { decrement: amount } } });
      return tx.transaction.create({
        data: {
          invoiceId,
          userId: user.id,
          productId: product.id,
          gameAccount,
          amount,
          paymentMethod: "saldo",
          status: "PAID",
          paidAt: new Date(),
        },
      });
    });

    processVipaymentOrder(trx.id).catch((err) => console.error("VIPayment order processing failed", err));

    return apiOk({ invoiceId: trx.invoiceId, paymentUrl: null, status: trx.status }, "Pembayaran berhasil, pesanan sedang diproses", 201);
  }

  // Everything else routes through Tripay.
  try {
    const result = await tripay.createTransaction({
      method: paymentMethod,
      merchantRef: invoiceId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      orderItems: [{ sku: product.sku, name: `${product.game.name} - ${product.name}`, price: amount, quantity: 1 }],
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/payment/callback`,
      returnUrl: `${process.env.NEXTAUTH_URL}/cek-transaksi?invoice=${invoiceId}`,
    });

    const trx = await prisma.transaction.create({
      data: {
        invoiceId,
        userId: session?.user?.id,
        productId: product.id,
        gameAccount,
        amount,
        paymentMethod,
        paymentRef: result.reference,
        paymentUrl: result.checkout_url,
        status: "PENDING",
      },
    });

    return apiOk(
      { invoiceId: trx.invoiceId, paymentUrl: trx.paymentUrl, qrUrl: result.qr_url, payCode: result.pay_code },
      "Transaksi dibuat, lanjutkan pembayaran",
      201
    );
  } catch (error) {
    if (error instanceof PaymentError) {
      return apiError(`Gateway pembayaran belum tersedia: ${error.message}`, 503);
    }
    console.error("Failed to create Tripay transaction", error);
    return apiError("Gagal membuat transaksi pembayaran, coba lagi", 500);
  }
}
