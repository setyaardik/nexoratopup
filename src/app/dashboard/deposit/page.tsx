import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentChannelOptions } from "@/lib/payment";
import { DepositForm } from "@/components/dashboard/DepositForm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateWIB, formatRupiah } from "@/lib/utils";

export default async function DepositPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [channels, user, deposits] = await Promise.all([
    getPaymentChannelOptions(),
    prisma.user.findUnique({ where: { id: userId }, select: { balance: true } }),
    prisma.deposit.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Deposit Saldo</h1>
        <p className="mt-1 text-sm text-text-muted">
          Saldo NEXORA saat ini:{" "}
          <span className="font-bold text-text">{formatRupiah(user?.balance ?? 0)}</span>
        </p>
      </div>

      <DepositForm channels={channels} />

      <div>
        <h2 className="mb-3 font-heading text-lg font-bold text-text">Riwayat Deposit</h2>
        {deposits.length === 0 ? (
          <Card className="p-8 text-center text-sm text-text-muted">Belum ada riwayat deposit.</Card>
        ) : (
          <Card className="divide-y divide-white/5 p-0">
            {deposits.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div>
                  <div className="font-medium text-text">{formatRupiah(d.amount)}</div>
                  <div className="text-xs text-text-muted">{formatDateWIB(d.createdAt)}</div>
                </div>
                <Badge variant={d.status === "SUCCESS" ? "success" : d.status === "FAILED" ? "danger" : "warning"}>
                  {d.status}
                </Badge>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
