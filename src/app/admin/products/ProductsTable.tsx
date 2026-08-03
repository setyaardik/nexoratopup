"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface AdminProductRow {
  id: string;
  name: string;
  sku: string;
  sellPrice: number;
  resellerPrice: number | null;
  agenPrice: number | null;
  isActive: boolean;
  game: { name: string };
}

export function ProductsTable({ initialProducts }: { initialProducts: AdminProductRow[] }) {
  const { showToast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [savingId, setSavingId] = useState<string | null>(null);

  function updateLocal(id: string, patch: Partial<AdminProductRow>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  async function save(product: AdminProductRow) {
    setSavingId(product.id);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          sellPrice: product.sellPrice,
          resellerPrice: product.resellerPrice,
          agenPrice: product.agenPrice,
          isActive: product.isActive,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message ?? "Gagal menyimpan produk", "error");
        return;
      }
      showToast(`${product.name} berhasil diperbarui`, "success");
    } catch {
      showToast("Terjadi kesalahan, coba lagi", "error");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-text-muted">
            <th className="px-4 py-3.5 font-semibold">Produk</th>
            <th className="px-4 py-3.5 font-semibold">Harga Jual</th>
            <th className="px-4 py-3.5 font-semibold">Harga Reseller</th>
            <th className="px-4 py-3.5 font-semibold">Harga Agen</th>
            <th className="px-4 py-3.5 font-semibold">Status</th>
            <th className="px-4 py-3.5 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium text-text">{p.name}</div>
                <div className="text-xs text-text-muted">
                  {p.game.name} · {p.sku}
                </div>
              </td>
              <td className="px-4 py-3">
                <PriceInput value={p.sellPrice} onChange={(v) => updateLocal(p.id, { sellPrice: v })} />
              </td>
              <td className="px-4 py-3">
                <PriceInput value={p.resellerPrice} onChange={(v) => updateLocal(p.id, { resellerPrice: v })} />
              </td>
              <td className="px-4 py-3">
                <PriceInput value={p.agenPrice} onChange={(v) => updateLocal(p.id, { agenPrice: v })} />
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => updateLocal(p.id, { isActive: !p.isActive })}
                  className={cn("cursor-pointer")}
                >
                  <Badge variant={p.isActive ? "success" : "neutral"}>{p.isActive ? "Aktif" : "Nonaktif"}</Badge>
                </button>
              </td>
              <td className="px-4 py-3">
                <Button size="sm" isLoading={savingId === p.id} onClick={() => save(p)}>
                  Simpan
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function PriceInput({ value, onChange }: { value: number | null; onChange: (value: number) => void }) {
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-28 rounded-lg border border-white/10 bg-surface-2 px-2.5 py-1.5 text-sm text-text outline-none focus:border-cyan/60"
    />
  );
}
