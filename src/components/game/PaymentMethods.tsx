"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn, formatRupiah } from "@/lib/utils";
import type { PaymentChannelOption } from "@/lib/constants";

interface PaymentMethodsProps {
  channels: PaymentChannelOption[];
  selected: string | null;
  onSelect: (code: string) => void;
  walletBalance?: number;
}

const GROUPS: PaymentChannelOption["group"][] = ["QRIS", "E-Wallet", "Virtual Account", "Minimarket"];

export function PaymentMethods({ channels, selected, onSelect, walletBalance }: PaymentMethodsProps) {
  const [activeGroup, setActiveGroup] = useState<PaymentChannelOption["group"]>("QRIS");
  const groupChannels = channels.filter((c) => c.group === activeGroup);

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="gradient-bg flex size-6 items-center justify-center rounded-full text-xs font-bold text-white">
          3
        </span>
        <h2 className="font-heading text-base font-bold text-text">Pilih Pembayaran</h2>
      </div>

      {walletBalance != null && walletBalance > 0 && (
        <button
          type="button"
          onClick={() => onSelect("saldo")}
          className={cn(
            "mb-4 flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all",
            selected === "saldo"
              ? "border-cyan bg-cyan/10 shadow-[0_0_16px_rgba(201,161,90,0.16)]"
              : "border-white/10 bg-surface-2 hover:border-[rgba(201,161,90,0.4)]"
          )}
        >
          <span className="flex items-center gap-2 text-sm font-bold text-text">
            <Wallet className="size-4" /> Saldo NEXORA
          </span>
          <span className="text-sm font-semibold text-success">{formatRupiah(walletBalance)}</span>
        </button>
      )}

      <div className="hide-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setActiveGroup(group)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              activeGroup === group ? "gradient-bg text-white" : "border border-[rgba(201,161,90,0.2)] text-text-muted hover:border-[rgba(201,161,90,0.45)]"
            )}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {groupChannels.map((channel) => (
          <button
            key={channel.code}
            type="button"
            onClick={() => onSelect(channel.code)}
            className={cn(
              "rounded-xl border p-3 text-left text-sm font-semibold transition-all",
              selected === channel.code
                ? "border-cyan bg-cyan/10 text-text shadow-[0_0_16px_rgba(201,161,90,0.16)]"
                : "border-white/10 bg-surface-2 text-text-muted hover:border-[rgba(201,161,90,0.4)]"
            )}
          >
            {channel.name}
          </button>
        ))}
        {groupChannels.length === 0 && (
          <p className="col-span-full py-3 text-sm text-text-muted">Tidak ada metode di kategori ini.</p>
        )}
      </div>
    </Card>
  );
}
