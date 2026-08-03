"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface PromoBanner {
  gameSlug: string;
  gameName: string;
  productName: string;
  originalPrice: number;
  promoPrice: number;
}

const BANNER_STYLES = [
  "linear-gradient(115deg, #211b12 0%, #2c2315 55%, #1a1510 100%)",
  "linear-gradient(115deg, #1d1a12 0%, #292415 55%, #16130e 100%)",
  "linear-gradient(115deg, #231a11 0%, #2f2113 55%, #19130e 100%)",
];

export function PromoSlider({ banners }: { banners: PromoBanner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[index];
  const discount = Math.round(100 - (banner.promoPrice / banner.originalPrice) * 100);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-[#c9a15a]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a15a]">Flash Sale</span>
      </div>

      <Link
        href={`/games/${banner.gameSlug}`}
        className="relative flex h-44 items-center overflow-hidden rounded-2xl border border-[rgba(201,161,90,0.22)] transition-opacity hover:opacity-95 sm:h-52"
        style={{ background: BANNER_STYLES[index % BANNER_STYLES.length] }}
      >
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[radial-gradient(circle,rgba(201,161,90,0.14),transparent_70%)]" />
        <div className="relative px-6 sm:px-10">
          <span className="mb-3 inline-block rounded-full border border-[#c9a15a]/50 bg-[#c9a15a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1610]">
            Flash Sale
          </span>
          <div className="font-heading text-2xl font-semibold text-[#f2ede2] sm:text-3xl">
            {banner.gameName}
            <span className="mx-2 text-[#c9a15a]">&mdash;</span>
            <span className="italic text-[#dfc48f]">{banner.productName}</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm text-[#a39a89]">
            <span className="line-through">{formatRupiah(banner.originalPrice)}</span>
            <span className="text-base font-semibold text-[#dfc48f]">{formatRupiah(banner.promoPrice)}</span>
            <span className="rounded-full border border-[rgba(201,161,90,0.4)] px-2 py-0.5 text-xs font-semibold text-[#dfc48f]">
              -{discount}%
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 right-6 flex gap-2">
          {banners.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-0.5 rounded-full transition-all duration-300",
                i === index ? "w-7 bg-[#c9a15a]" : "w-2 bg-[rgba(201,161,90,0.3)]"
              )}
            />
          ))}
        </div>
      </Link>
    </section>
  );
}
