"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatDateWIB, formatRupiah } from "@/lib/utils";
import { TRANSACTION_STATUS_LABEL } from "@/lib/constants";
import type { TransactionStatus } from "@/types/transaction";

interface AdminTransactionRow {
  id: string;
  invoiceId: string;
  createdAt: string;
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
  product: { name: string; game: { name: string } };
  user: { name: string; email: string } | null;
}

const STATUS_OPTIONS: (TransactionStatus | "all")[] = [
  "all",
  "PENDING",
  "PAID",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "REFUNDED",
  "EXPIRED",
];

const STATUS_VARIANT: Record<TransactionStatus, "success" | "danger" | "warning" | "info" | "neutral"> = {
  PENDING: "warning",
  PAID: "info",
  PROCESSING: "info",
  SUCCESS: "success",
  FAILED: "danger",
  REFUNDED: "neutral",
  EXPIRED: "danger",
};

export function AdminTransactionsClient() {
  const { showToast } = useToast();
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const [transactions, setTransactions] = useState<AdminTransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/transactions?${params.toString()}`);
    const json = await res.json();
    if (json.success) setTransactions(json.data.transactions);
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q]);

  async function retry(transactionId: string) {
    setActingId(transactionId);
    try {
      const res = await fetch("/api/vipayment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message ?? "Gagal memproses ulang", "error");
        return;
      }
      showToast("Pesanan diproses ulang", "success");
      load();
    } finally {
      setActingId(null);
    }
  }

  async function refund(transactionId: string) {
    setActingId(transactionId);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, action: "refund" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message ?? "Gagal melakukan refund", "error");
        return;
      }
      showToast("Transaksi berhasil direfund", "success");
      load();
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Cari invoice..." value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:max-w-xs">
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "Semua Status" : TRANSACTION_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3.5 font-semibold">Invoice</th>
              <th className="px-4 py-3.5 font-semibold">Tanggal</th>
              <th className="px-4 py-3.5 font-semibold">Produk</th>
              <th className="px-4 py-3.5 font-semibold">Customer</th>
              <th className="px-4 py-3.5 font-semibold">Total</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                  Memuat...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                  Tidak ada transaksi.
                </td>
              </tr>
            ) : (
              transactions.map((trx) => (
                <tr key={trx.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{trx.invoiceId}</td>
                  <td className="px-4 py-3 text-text-muted">{formatDateWIB(trx.createdAt)}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {trx.product.game.name} - {trx.product.name}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{trx.user?.email ?? "Guest"}</td>
                  <td className="px-4 py-3 font-medium text-text">{formatRupiah(trx.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[trx.status]}>{TRANSACTION_STATUS_LABEL[trx.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {trx.status === "FAILED" && (
                        <Button size="sm" variant="outline" isLoading={actingId === trx.id} onClick={() => retry(trx.id)}>
                          Retry
                        </Button>
                      )}
                      {["PAID", "PROCESSING", "SUCCESS"].includes(trx.status) && (
                        <Button size="sm" variant="danger" isLoading={actingId === trx.id} onClick={() => refund(trx.id)}>
                          Refund
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
