"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn, formatRupiah } from "@/lib/utils";
import type { PaymentChannelOption } from "@/lib/constants";

const PRESET_AMOUNTS = [50_000, 100_000, 200_000, 500_000, 1_000_000];

export function DepositForm({ channels }: { channels: PaymentChannelOption[] }) {
  const { showToast } = useToast();
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const finalAmount = amount ?? Number(customAmount) ?? 0;
  const canSubmit = finalAmount >= 10_000 && !!method && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/deposit/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, method }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message ?? "Gagal membuat deposit", "error");
        return;
      }
      window.location.href = json.data.paymentUrl;
    } catch {
      showToast("Terjadi kesalahan, coba lagi", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 font-heading text-base font-bold text-text">Deposit Saldo</h2>

      <div className="mb-2 text-sm font-medium text-text">Nominal</div>
      <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setAmount(preset);
              setCustomAmount("");
            }}
            className={cn(
              "rounded-xl border p-2.5 text-xs font-semibold transition-all",
              amount === preset
                ? "border-cyan bg-cyan/10 text-text shadow-[0_0_16px_rgba(201,161,90,0.16)]"
                : "border-white/10 bg-surface-2 text-text-muted hover:border-[rgba(201,161,90,0.4)]"
            )}
          >
            {formatRupiah(preset)}
          </button>
        ))}
      </div>
      <Input
        placeholder="Atau masukkan nominal lain"
        type="number"
        min={10000}
        value={customAmount}
        onChange={(e) => {
          setCustomAmount(e.target.value);
          setAmount(null);
        }}
      />

      <div className="mb-2 mt-5 text-sm font-medium text-text">Metode Pembayaran</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {channels.map((channel) => (
          <button
            key={channel.code}
            type="button"
            onClick={() => setMethod(channel.code)}
            className={cn(
              "rounded-xl border p-2.5 text-left text-xs font-semibold transition-all",
              method === channel.code
                ? "border-cyan bg-cyan/10 text-text shadow-[0_0_16px_rgba(201,161,90,0.16)]"
                : "border-white/10 bg-surface-2 text-text-muted hover:border-[rgba(201,161,90,0.4)]"
            )}
          >
            {channel.name}
          </button>
        ))}
      </div>

      <Button className="mt-5 w-full" disabled={!canSubmit} isLoading={submitting} onClick={handleSubmit}>
        Deposit Sekarang
      </Button>
    </Card>
  );
}
