import { AdminTransactionsClient } from "./AdminTransactionsClient";

export default function AdminTransactionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Monitor Transaksi</h1>
        <p className="mt-1 text-sm text-text-muted">Pantau semua transaksi, retry pesanan gagal, dan proses refund.</p>
      </div>
      <AdminTransactionsClient />
    </div>
  );
}
