import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { AdminChart, type DailyPoint } from "@/components/admin/AdminChart";
import { TransactionTable, type TransactionRow } from "@/components/dashboard/TransactionTable";
import { formatRupiah } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [todayCount, todayRevenueAgg, totalCount, successCount, recentWindow, recentTransactions] = await Promise.all([
    prisma.transaction.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.transaction.aggregate({ where: { status: "SUCCESS", createdAt: { gte: startOfToday } }, _sum: { amount: true } }),
    prisma.transaction.count(),
    prisma.transaction.count({ where: { status: "SUCCESS" } }),
    prisma.transaction.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, amount: true, status: true },
    }),
    prisma.transaction.findMany({
      include: { product: { include: { game: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  const chartData: DailyPoint[] = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(sevenDaysAgo);
    day.setDate(day.getDate() + i);
    const dayKey = day.toDateString();
    const dayTransactions = recentWindow.filter((t) => t.createdAt.toDateString() === dayKey);
    return {
      date: day.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
      transactions: dayTransactions.length,
      revenue: dayTransactions.filter((t) => t.status === "SUCCESS").reduce((sum, t) => sum + t.amount, 0),
    };
  });

  const rows: TransactionRow[] = recentTransactions.map((trx) => ({
    id: trx.id,
    invoiceId: trx.invoiceId,
    createdAt: trx.createdAt.toISOString(),
    gameName: trx.product.game.name,
    productName: trx.product.name,
    amount: trx.amount,
    status: trx.status,
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-text">Admin Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs text-text-muted">Transaksi Hari Ini</div>
          <div className="mt-1 font-heading text-2xl font-extrabold text-text">{todayCount}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-text-muted">Revenue Hari Ini</div>
          <div className="mt-1 font-heading text-2xl font-extrabold text-text">
            {formatRupiah(todayRevenueAgg._sum.amount ?? 0)}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-text-muted">Success Rate</div>
          <div className="mt-1 font-heading text-2xl font-extrabold text-success">{successRate}%</div>
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="mb-4 font-heading text-base font-bold text-text">Transaksi 7 Hari Terakhir</h2>
        <AdminChart data={chartData} />
      </Card>

      <div>
        <h2 className="mb-3 font-heading text-lg font-bold text-text">Transaksi Terbaru</h2>
        <TransactionTable transactions={rows} />
      </div>
    </div>
  );
}
