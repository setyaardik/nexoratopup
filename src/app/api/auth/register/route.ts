import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(100),
    email: z.string().email("Email tidak valid"),
    phone: z.string().min(8).max(20).optional().or(z.literal("")),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
    referralCode: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

function generateReferralCode(name: string): string {
  const initials = name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "NXG";
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${initials}${suffix}`;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`register:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return apiError("Terlalu banyak percobaan pendaftaran. Coba lagi beberapa menit lagi.", 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Data tidak valid", 422);
  }

  const { name, email, phone, password, referralCode } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return apiError("Email sudah terdaftar", 409);
  }

  let referredBy: string | undefined;
  if (referralCode) {
    const referrer = await prisma.user.findUnique({ where: { referralCode } });
    if (referrer) referredBy = referrer.id;
  }

  const hashed = await bcrypt.hash(password, 12);

  let newReferralCode = generateReferralCode(name);
  for (let attempt = 0; attempt < 3; attempt++) {
    const clash = await prisma.user.findUnique({ where: { referralCode: newReferralCode } });
    if (!clash) break;
    newReferralCode = generateReferralCode(name);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || undefined,
      password: hashed,
      referralCode: newReferralCode,
      referredBy,
    },
    select: { id: true, name: true, email: true },
  });

  return apiOk(user, "Pendaftaran berhasil, silakan masuk", 201);
}
