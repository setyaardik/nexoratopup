import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";

const profileSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().max(20).optional().or(z.literal("")),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
  })
  .refine((data) => !data.newPassword || !!data.currentPassword, {
    message: "Password saat ini wajib diisi untuk mengganti password",
    path: ["currentPassword"],
  });

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return apiError("Masuk terlebih dahulu", 401);

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);

  const { name, phone, currentPassword, newPassword } = parsed.data;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return apiError("Pengguna tidak ditemukan", 404);

  const data: { name?: string; phone?: string; password?: string } = {};
  if (name) data.name = name;
  if (phone !== undefined) data.phone = phone || undefined;

  if (newPassword) {
    const valid = await bcrypt.compare(currentPassword!, user.password);
    if (!valid) return apiError("Password saat ini salah", 400);
    data.password = await bcrypt.hash(newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: { name: true, email: true, phone: true },
  });

  return apiOk(updated, "Profil berhasil diperbarui");
}
