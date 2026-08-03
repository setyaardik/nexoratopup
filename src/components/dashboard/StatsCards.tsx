import { Receipt, Wallet, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";

interface StatsCardsProps {
  transactionsThisMonth: number;
  spentThisMonth: number;
  balance: number;
  role: string;
}

export function StatsCards({ transactionsThisMonth, spentThisMonth, balance, role }: StatsCardsProps) {
  const cards = [
    { icon: Receipt, label: "Transaksi Bulan Ini", value: String(transactionsThisMonth) },
    { icon: TrendingUp, label: "Total Pengeluaran", value: formatRupiah(spentThisMonth) },
    { icon: Wallet, label: "Saldo NEXORA", value: formatRupiah(balance) },
    { icon: Award, label: "Status Akun", value: role, isBadge: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-5">
          <card.icon className="size-5 text-gold" />
          <div className="mt-3 text-xs text-text-muted">{card.label}</div>
          {card.isBadge ? (
            <Badge variant="info" className="mt-1.5">
              {card.value}
            </Badge>
          ) : (
            <div className="mt-1 font-heading text-lg font-extrabold text-text">{card.value}</div>
          )}
        </Card>
      ))}
    </div>
  );
}
