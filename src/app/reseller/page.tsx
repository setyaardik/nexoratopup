import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RESELLER_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ResellerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#c9a15a]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a15a]">Bisnis</span>
          <span className="h-px w-10 bg-[#c9a15a]" />
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-text sm:text-4xl">Program Reseller NexoraGame</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
          Jadi reseller atau agen NexoraGame dan nikmati harga lebih murah untuk setiap top up. Cocok untuk kamu yang
          ingin berjualan diamond &amp; voucher game.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {RESELLER_TIERS.map((tier, i) => (
          <Card
            key={tier.name}
            className={cn(
              "p-6",
              i === 1 && "border-[rgba(201,161,90,0.5)] shadow-[0_0_30px_rgba(201,161,90,0.12)]"
            )}
          >
            <div className="font-heading text-xl font-semibold text-text">{tier.name}</div>
            <div className="mt-1 text-sm font-semibold text-gold">{tier.discount}</div>
            <div className="my-4 h-px bg-[rgba(201,161,90,0.16)]" />
            <ul className="flex flex-col gap-2.5">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-text-muted">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  {perk}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-10 flex flex-col items-center gap-4 p-8 text-center">
        <h2 className="font-heading text-2xl font-semibold text-text">Siap jadi reseller?</h2>
        <p className="max-w-md text-sm leading-relaxed text-text-muted">
          Daftar akun, isi saldo NEXORA lewat menu Deposit di dashboard, lalu mulai transaksi dengan harga reseller.
        </p>
        <div className="flex gap-3">
          <Link
            href="/auth/register"
            className="rounded-lg bg-[#c9a15a] px-6 py-3 text-sm font-semibold text-[#1a1610] transition-colors hover:bg-[#dab676]"
          >
            Daftar Sekarang
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-[rgba(201,161,90,0.4)] px-6 py-3 text-sm font-semibold text-[#dfc48f] transition-colors hover:bg-[rgba(201,161,90,0.08)]"
          >
            Masuk
          </Link>
        </div>
      </Card>
    </div>
  );
}
