import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Pengaturan Website</h1>
        <p className="mt-1 text-sm text-text-muted">Kelola informasi umum dan mode maintenance situs.</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
