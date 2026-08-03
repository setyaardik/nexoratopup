import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/guards";

export async function GET() {
  if (!(await requireAdminSession())) return apiError("Tidak diizinkan", 403);

  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return apiOk(settings);
}

const putSchema = z.object({
  settings: z.record(z.string(), z.string()),
});

export async function PUT(request: NextRequest) {
  if (!(await requireAdminSession())) return apiError("Tidak diizinkan", 403);

  const body = await request.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);

  await Promise.all(
    Object.entries(parsed.data.settings).map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );

  return apiOk(null, "Pengaturan disimpan");
}
