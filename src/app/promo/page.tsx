import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GameImage } from "@/components/ui/GameImage";
import { getRoleBasePrice } from "@/lib/pricing";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PromoPage() {
  const promoProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      promoPrice: { not: null },
      OR: [{ promoEndDate: null }, { promoEndDate: { gt: new Date() } }],
    },
    include: { game: true },
    orderBy: { promoEndDate: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-[#c9a15a]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a15a]">Promo</span>
      </div>
      <h1 className="mt-3 font-heading text-3xl font-semibold text-text">Promo &amp; Flash Sale</h1>
      <p className="mt-1.5 text-sm text-text-muted">Nikmati harga spesial untuk waktu terbatas.</p>

      {promoProducts.length === 0 ? (
        <Card className="mt-8 p-10 text-center text-sm text-text-muted">
          Belum ada promo aktif saat ini. Cek kembali nanti ya!
        </Card>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promoProducts.map((product) => {
            const original = getRoleBasePrice(product);
            const discount = Math.round(100 - (product.promoPrice! / original) * 100);
            return (
              <Link
                key={product.id}
                href={`/games/${product.game.slug}`}
                className="card-surface glow-border relative overflow-hidden rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <Badge variant="promo" className="absolute right-3 top-3 z-10">
                  -{discount}%
                </Badge>
                <div className="relative size-14 overflow-hidden rounded-xl">
                  <GameImage src={product.game.image} alt={product.game.name} />
                </div>
                <div className="mt-3 font-heading text-base font-semibold text-text">{product.game.name}</div>
                <div className="text-xs text-text-muted">{product.name}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-text-muted line-through">{formatRupiah(original)}</span>
                  <span className="text-sm font-extrabold text-gold">{formatRupiah(product.promoPrice!)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
