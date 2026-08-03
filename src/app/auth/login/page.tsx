"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);

    if (res?.error) {
      showToast("Email atau password salah", "error");
      return;
    }
    showToast("Berhasil masuk", "success");
    router.push("/dashboard");
    router.refresh();
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
            TopUp Game Instan, Murah, &amp; Terpercaya. Masuk untuk kelola transaksi dan saldo kamu.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-3xl font-semibold text-text">Masuk ke NexoraGame</h1>
          <p className="mt-2 text-sm text-text-muted">Selamat datang kembali, gamers!</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              required
              placeholder="kamu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Button type="submit" isLoading={loading} className="mt-2 w-full">
              Masuk
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-text-muted">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="font-semibold text-gold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
