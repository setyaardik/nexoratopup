import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";

/**
 * Webhook VIPayment mengirim update status order (trxid dikembalikan dari
 * createOrder()). VIPayment tidak mendokumentasikan skema signing publik untuk
 * webhook H2H mereka, jadi sebagai gantinya kita pakai shared-secret token di
 * query string (?token=) jika VIPAYMENT_WEBHOOK_TOKEN di-set.
 */
const callbackSchema = z.object({
  trxid: z.string().min(1),
  status: z.enum(["success", "error", "processing", "pending"]),
  note: z.string().optional(),
  serial_number: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const expectedToken = process.env.VIPAYMENT_WEBHOOK_TOKEN;
  if (expectedToken) {
    const token = request.nextUrl.searchParams.get("token");
    if (token !== expectedToken) {
      return apiError("Token tidak valid", 401);
    }
  }

  const body = await request.json().catch(() => null);
  const parsed = callbackSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Payload tidak valid", 422);
  }

  const { trxid, status, note } = parsed.data;

  const trx = await prisma.transaction.findFirst({ where: { vipaymentRef: trxid } });
  if (!trx) return apiError("Transaksi tidak ditemukan", 404);

  if (status === "success" && trx.status !== "SUCCESS") {
    await prisma.transaction.update({
      where: { id: trx.id },
      data: { status: "SUCCESS", completedAt: new Date() },
    });
  } else if (status === "error" && trx.status !== "FAILED") {
    await prisma.transaction.update({
      where: { id: trx.id },
      data: { status: "FAILED", failedReason: note ?? "Pesanan gagal diproses VIPayment" },
    });
  }

  return apiOk(null, "OK");
}
