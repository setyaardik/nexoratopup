import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateWIB, formatRupiah } from "@/lib/utils";
import { TRANSACTION_STATUS_LABEL } from "@/lib/constants";
import type { TransactionStatus } from "@/types/transaction";

export interface TransactionRow {
  id: string;
  invoiceId: string;
  createdAt: string;
  gameName: string;
  productName: string;
  amount: number;
  status: TransactionStatus;
}

const STATUS_BADGE_VARIANT: Record<TransactionStatus, "success" | "danger" | "warning" | "info" | "neutral"> = {
  PENDING: "warning",
  PAID: "info",
  PROCESSING: "info",
  SUCCESS: "success",
  FAILED: "danger",
  REFUNDED: "neutral",
  EXPIRED: "danger",
};

export function TransactionTable({ transactions }: { transactions: TransactionRow[] }) {
  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-text-muted">Belum ada transaksi.</Card>
    );
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-text-muted">
            <th className="px-5 py-3.5 font-semibold">Tanggal</th>
            <th className="px-5 py-3.5 font-semibold">Game</th>
            <th className="px-5 py-3.5 font-semibold">Nominal</th>
            <th className="px-5 py-3.5 font-semibold">Harga</th>
            <th className="px-5 py-3.5 font-semibold">Status</th>
            <th className="px-5 py-3.5 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trx) => (
            <tr key={trx.id} className="border-b border-white/5 last:border-0">
              <td className="px-5 py-3.5 text-text-muted">{formatDateWIB(trx.createdAt)}</td>
              <td className="px-5 py-3.5 font-medium text-text">{trx.gameName}</td>
              <td className="px-5 py-3.5 text-text-muted">{trx.productName}</td>
              <td className="px-5 py-3.5 font-medium text-text">{formatRupiah(trx.amount)}</td>
              <td className="px-5 py-3.5">
                <Badge variant={STATUS_BADGE_VARIANT[trx.status]}>{TRANSACTION_STATUS_LABEL[trx.status]}</Badge>
              </td>
              <td className="px-5 py-3.5">
                <Link href={`/cek-transaksi?invoice=${trx.invoiceId}`} className="font-semibold text-accent hover:underline">
                  Lihat
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
