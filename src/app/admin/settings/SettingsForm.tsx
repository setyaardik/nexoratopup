"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { showToast } = useToast();
  const [siteName, setSiteName] = useState(initialSettings.site_name ?? "");
  const [whatsappCs, setWhatsappCs] = useState(initialSettings.whatsapp_cs ?? "");
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings.maintenance_mode === "true");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            site_name: siteName,
            whatsapp_cs: whatsappCs,
            maintenance_mode: String(maintenanceMode),
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message ?? "Gagal menyimpan pengaturan", "error");
        return;
      }
      showToast("Pengaturan berhasil disimpan", "success");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="flex flex-col gap-4 p-5 sm:p-6">
        <Input label="Nama Website" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        <Input
          label="Nomor WhatsApp CS"
          value={whatsappCs}
          onChange={(e) => setWhatsappCs(e.target.value)}
          placeholder="62812xxxxxxx"
        />

        <div>
          <div className="mb-1.5 text-sm font-medium text-text">Mode Maintenance</div>
          <button
            type="button"
            onClick={() => setMaintenanceMode((v) => !v)}
            className={cn(
              "flex h-8 w-14 items-center rounded-full p-1 transition-colors",
              maintenanceMode ? "bg-danger" : "bg-white/10"
            )}
          >
            <span
              className={cn(
                "size-6 rounded-full bg-white transition-transform",
                maintenanceMode && "translate-x-6"
              )}
            />
          </button>
        </div>

        <Button type="submit" isLoading={saving} className="mt-2 w-full sm:w-fit">
          Simpan Pengaturan
        </Button>
      </Card>
    </form>
  );
}
