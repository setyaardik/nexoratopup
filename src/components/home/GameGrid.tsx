"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GameImage } from "@/components/ui/GameImage";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { GAME_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { GameListItemDTO } from "@/types/game";

const COLLAPSE_COUNT = 8;

function categoryLabel(value: string): string {
  return GAME_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function GameGrid({ initialGames, query = "" }: { initialGames: GameListItemDTO[]; query?: string }) {
  const [category, setCategory] = useState("all");
  const [games, setGames] = useState(initialGames);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const q = query;
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (q) params.set("q", q);

    fetch(`/api/games?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setGames(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [category, q]);

  const visibleGames = showAll ? games : games.slice(0, COLLAPSE_COUNT);

  return (
    <section id="games" className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-[#c9a15a]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a15a]">Katalog Game</span>
      </div>
      <h2 className="mt-3 font-heading text-3xl font-semibold text-text">Game Populer</h2>
      <p className="mt-1.5 text-sm text-text-muted">Pilih game, top up langsung diproses dalam hitungan detik.</p>

      <div className="hide-scrollbar mt-7 mb-7 flex gap-2.5 overflow-x-auto">
        {GAME_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
              category === cat.value
                ? "gradient-bg text-white"
                : "border border-[rgba(201,161,90,0.2)] text-text-muted hover:border-[rgba(201,161,90,0.45)] hover:text-text"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : games.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">Tidak ada game ditemukan.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {visibleGames.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group card-surface relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,161,90,0.45)]"
            >
              {game.hasPromo && (
                <Badge variant="promo" className="absolute right-3 top-3 z-10">
                  Promo
                </Badge>
              )}
              <div className="relative size-14 overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
                <GameImage src={game.image} alt={game.name} />
              </div>
              <div className="mt-4 line-clamp-1 font-heading text-base font-semibold text-text">{game.name}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                <span className="h-0.5 w-3 bg-[#c9a15a]" />
                {categoryLabel(game.category)}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!showAll && games.length > COLLAPSE_COUNT && (
        <div className="mt-9 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="btn-outline rounded-lg px-7 py-3 text-sm font-semibold"
          >
            Tampilkan Semua
          </button>
        </div>
      )}
    </section>
  );
}
