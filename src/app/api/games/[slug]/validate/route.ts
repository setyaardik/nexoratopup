import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { vipayment } from "@/lib/vipayment";

const validateSchema = z.object({
  userId: z.string().min(1, "User ID wajib diisi"),
  zoneId: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const body = await request.json().catch(() => null);
  const parsed = validateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);
  }

  const game = await prisma.game.findUnique({ where: { slug, isActive: true } });
  if (!game) return apiError("Game tidak ditemukan", 404);

  if (!vipayment.isConfigured()) {
    // No live VIPayment credentials configured yet — let the checkout flow
    // continue without a validated username rather than blocking purchases.
    return apiOk({ valid: true, username: null }, "Validasi dilewati (VIPayment belum dikonfigurasi)");
  }

  const result = await vipayment.validateGameId(game.slug, parsed.data.userId, parsed.data.zoneId);
  if (!result.valid) {
    return apiError("User ID tidak ditemukan, atau game ini belum mendukung validasi otomatis", 422);
  }

  return apiOk(result);
}
