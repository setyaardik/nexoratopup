"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface ProfileFormProps {
  initialName: string;
  email: string;
  initialPhone: string;
  referralCode: string | null;
}

export function ProfileForm({ initialName, email, initialPhone, referralCode }: ProfileFormProps) {
  const { showToast } = useToast();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          ...(newPassword ? { currentPassword, newPassword } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message ?? "Gagal memperbarui profil", "error");
        return;
      }
      showToast("Profil berhasil diperbarui", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      showToast("Terjadi kesalahan, coba lagi", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card className="p-5 sm:p-6">
        <h2 className="mb-4 font-heading text-base font-bold text-text">Informasi Akun</h2>
        <div className="flex flex-col gap-4">
          <Input label="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" value={email} disabled />
          <Input label="No. HP" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Kode Referral Kamu" value={referralCode ?? "-"} disabled />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="mb-4 font-heading text-base font-bold text-text">Ganti Password</h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Password Saat Ini"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Kosongkan jika tidak ganti password"
          />
          <Input
            label="Password Baru"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
          />
        </div>
      </Card>

      <Button type="submit" isLoading={saving} className="w-full sm:w-fit">
        Simpan Perubahan
      </Button>
    </form>
  );
}
