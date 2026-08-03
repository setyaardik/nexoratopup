"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { InvoiceDetail } from "@/components/transaction/InvoiceDetail";
import { useTransaction } from "@/hooks/useTransaction";

export function CekTransaksiClient({ initialInvoice }: { initialInvoice: string }) {
  const [inputValue, setInputValue] = useState(initialInvoice);
  const [activeInvoice, setActiveInvoice] = useState(initialInvoice || null);

  const { transaction, error, isLoading } = useTransaction(activeInvoice);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActiveInvoice(inputValue.trim() || null);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 md:px-8">
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-[#c9a15a]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a15a]">Status Pesanan</span>
      </div>
      <h1 className="mt-3 font-heading text-3xl font-semibold text-text">Cek Transaksi</h1>
      <p className="mt-1.5 text-sm text-text-muted">Masukkan nomor invoice untuk melihat status transaksi kamu.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <Input
          placeholder="INV-20260101-12345"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" isLoading={isLoading}>
          <Search className="size-4" />
          Cek Status
        </Button>
      </form>

      <div className="mt-6">
        {isLoading && !transaction && <Skeleton className="h-64 rounded-2xl" />}
        {error && <p className="text-center text-sm font-medium text-danger">{error}</p>}
        {transaction && <InvoiceDetail transaction={transaction} />}
      </div>
    </div>
  );
}
