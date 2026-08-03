import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/guards";

export async function GET() {
  if (!(await requireAdminSession())) return apiError("Tidak diizinkan", 403);

  const products = await prisma.product.findMany({
    include: { game: { select: { name: true, slug: true } } },
    orderBy: [{ game: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return apiOk(products);
}

const patchSchema = z.object({
  productId: z.string().min(1),
  sellPrice: z.number().int().positive().optional(),
  resellerPrice: z.number().int().positive().nullable().optional(),
  agenPrice: z.number().int().positive().nullable().optional(),
  promoPrice: z.number().int().positive().nullable().optional(),
  promoEndDate: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  if (!(await requireAdminSession())) return apiError("Tidak diizinkan", 403);

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);

  const { productId, promoEndDate, ...rest } = parsed.data;

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...rest,
      ...(promoEndDate !== undefined ? { promoEndDate: promoEndDate ? new Date(promoEndDate) : null } : {}),
    },
  });

  return apiOk(product, "Produk berhasil diperbarui");
}
