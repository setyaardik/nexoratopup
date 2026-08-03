"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  referralCode: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message ?? "Gagal mendaftar", "error");
        return;
      }
      showToast("Pendaftaran berhasil, silakan masuk", "success");
      router.push("/auth/login");
    } catch {
      showToast("Terjadi kesalahan, coba lagi", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden border-r border-[rgba(201,161,90,0.18)] bg-[#0d0c0a] p-10 md:flex md:w-2/5">
        <div className="absolute -inset-20 rounded-full bg-[radial-gradient(circle,rgba(201,161,90,0.08),transparent_65%)]" />
        <div className="relative rounded-2xl border border-[rgba(201,161,90,0.3)] bg-surface/40 p-10 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-[rgba(201,161,90,0.4)] text-[#c9a15a]">
            <ShieldCheck className="size-8" />
          </div>
          <div className="font-display text-3xl font-semibold tracking-wide text-[#f2ede2]">
            Nexora<span className="italic text-[#c9a15a]">Game</span>
          </div>
          <div className="mx-auto my-5 h-px w-16 bg-[rgba(201,161,90,0.5)]" />
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-text-muted">
            Daftar sekarang dan nikmati top up game instan dengan harga bersahabat.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-3xl font-semibold text-text">Buat Akun Baru</h1>
          <p className="mt-2 text-sm text-text-muted">Gabung bersama ribuan gamers lainnya.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <Input
              label="Nama Lengkap"
              required
              placeholder="Nama kamu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              placeholder="kamu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="No. HP (opsional)"
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Input
              label="Konfirmasi Password"
              type="password"
              required
              placeholder="Ulangi password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <Input
              label="Kode Referral (opsional)"
              placeholder="Kode referral teman kamu"
              value={form.referralCode}
              onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
            />
            <Button type="submit" isLoading={loading} className="mt-2 w-full">
              Daftar
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-text-muted">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="font-semibold text-gold hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
