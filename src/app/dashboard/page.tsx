import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TransactionTable, type TransactionRow } from "@/components/dashboard/TransactionTable";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [transactionsThisMonth, spentAgg, user, recent] = await Promise.all([
    prisma.transaction.count({ where: { userId, createdAt: { gte: startOfMonth } } }),
    prisma.transaction.aggregate({
      where: { userId, status: "SUCCESS", createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { balance: true, role: true } }),
    prisma.transaction.findMany({
      where: { userId },
      include: { product: { include: { game: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const rows: TransactionRow[] = recent.map((trx) => ({
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
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Halo, {session!.user.name}!</h1>
        <p className="mt-1 text-sm text-text-muted">Selamat datang di dashboard NexoraGame kamu.</p>
      </div>

      <StatsCards
        transactionsThisMonth={transactionsThisMonth}
        spentThisMonth={spentAgg._sum.amount ?? 0}
        balance={user?.balance ?? 0}
        role={user?.role ?? "MEMBER"}
      />

      <div>
        <h2 className="mb-3 font-heading text-lg font-bold text-text">Transaksi Terakhir</h2>
        <TransactionTable transactions={rows} />
      </div>
    </div>
  );
}
