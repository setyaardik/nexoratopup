import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusTracker } from "@/components/transaction/StatusTracker";
import { formatDateWIB, formatRupiah } from "@/lib/utils";
import { TRANSACTION_STATUS_LABEL, TRANSACTION_STATUS_COLOR } from "@/lib/constants";
import type { TransactionDTO } from "@/types/transaction";

export function InvoiceDetail({ transaction }: { transaction: TransactionDTO }) {
  const accountEntries = Object.entries(transaction.gameAccount);

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs text-text-muted">Invoice ID</div>
          <div className="font-heading text-lg font-bold text-text">{transaction.invoiceId}</div>
        </div>
        <Badge variant="info" className={TRANSACTION_STATUS_COLOR[transaction.status]}>
          {TRANSACTION_STATUS_LABEL[transaction.status]}
        </Badge>
      </div>

      <StatusTracker status={transaction.status} />

      <div className="grid grid-cols-1 gap-2.5 border-t border-white/10 pt-4 text-sm sm:grid-cols-2">
        <Row label="Game" value={transaction.product.game.name} />
        <Row label="Nominal" value={transaction.product.name} />
        {accountEntries.map(([key, value]) => (
          <Row key={key} label={key} value={value} />
        ))}
        <Row label="Metode Bayar" value={transaction.paymentMethod} />
        <Row label="Total Bayar" value={formatRupiah(transaction.amount)} />
        <Row label="Waktu Order" value={formatDateWIB(transaction.createdAt)} />
        {transaction.completedAt && <Row label="Waktu Selesai" value={formatDateWIB(transaction.completedAt)} />}
        {transaction.failedReason && <Row label="Keterangan" value={transaction.failedReason} />}
      </div>

      {transaction.status === "PENDING" && transaction.paymentUrl && (
        <a href={transaction.paymentUrl} className="mt-5 block">
          <Button className="w-full">Bayar Sekarang</Button>
        </a>
      )}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="capitalize text-text-muted">{label}</span>
      <span className="text-right font-medium text-text">{value}</span>
    </div>
  );
}
