import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TransactionTable, type TransactionRow } from "@/components/dashboard/TransactionTable";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      include: { product: { include: { game: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.transaction.count({ where: { userId } }),
  ]);

  const rows: TransactionRow[] = transactions.map((trx) => ({
    id: trx.id,
    invoiceId: trx.invoiceId,
    createdAt: trx.createdAt.toISOString(),
    gameName: trx.product.game.name,
    productName: trx.product.name,
    amount: trx.amount,
    status: trx.status,
  }));

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-text">Riwayat Transaksi</h1>
      <TransactionTable transactions={rows} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/dashboard/riwayat?page=${i + 1}`}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg text-sm font-semibold",
                page === i + 1 ? "gradient-bg text-white" : "border border-white/10 text-text-muted"
              )}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
