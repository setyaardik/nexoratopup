"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn, formatRupiah } from "@/lib/utils";
import type { ProductDTO } from "@/types/game";

interface ProductGridProps {
  products: ProductDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProductGrid({ products, selectedId, onSelect }: ProductGridProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="gradient-bg flex size-6 items-center justify-center rounded-full text-xs font-bold text-white">
          2
        </span>
        <h2 className="font-heading text-base font-bold text-text">Pilih Nominal</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {products.map((product) => {
          const selected = selectedId === product.id;
          const hasPromo = product.promoPrice != null;
          const price = hasPromo ? product.promoPrice! : product.sellPrice;
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product.id)}
              className={cn(
                "relative rounded-xl border p-3.5 text-left transition-all",
                selected
                  ? "border-cyan bg-cyan/10 shadow-[0_0_16px_rgba(201,161,90,0.16)]"
                  : "border-white/10 bg-surface-2 hover:border-[rgba(201,161,90,0.4)]"
              )}
            >
              {hasPromo && (
                <Badge variant="promo" className="absolute right-2 top-2">
                  Promo
                </Badge>
              )}
              <div className="line-clamp-2 font-heading text-sm font-semibold text-text">{product.name}</div>
              {hasPromo && (
                <div className="mt-1.5 text-xs text-text-muted line-through">{formatRupiah(product.sellPrice)}</div>
              )}
              <div className={cn("mt-0.5 text-sm font-extrabold", hasPromo ? "text-gold" : "text-text")}>
                {formatRupiah(price)}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-text-muted">Harga sudah termasuk biaya layanan.</p>
    </Card>
  );
}
