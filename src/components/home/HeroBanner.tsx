"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const STATS = [
  { value: "500rb+", label: "Transaksi Sukses" },
  { value: "24/7", label: "Layanan Aktif" },
  { value: "4.9", label: "Rating Pengguna" },
];

export function HeroBanner() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/?${params.toString()}#games`);
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 pb-16 pt-12 md:flex-row md:items-center md:px-8 md:pt-20">
      <div className="w-full md:flex-1">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-[#c9a15a]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a15a]">
            Instan &amp; Aman
          </span>
        </div>

        <h1 className="font-heading text-4xl font-semibold leading-[1.12] text-text sm:text-5xl lg:text-6xl">
          TopUp Game
          <br />
          <span className="italic text-[#dfc48f]">Tercepat</span> &amp; <span className="italic text-[#dfc48f]">Termurah</span>
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted">
          Isi ulang diamond, UC, dan voucher game favoritmu dalam hitungan detik — dengan layanan yang aman dan harga
          yang pantas untuk para gamer.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-8 flex max-w-md gap-1.5 rounded-xl border border-[rgba(201,161,90,0.22)] bg-surface p-1.5"
        >
          <div className="flex flex-1 items-center gap-2.5 px-3">
            <Search className="size-4 shrink-0 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari game favoritmu..."
              className="w-full bg-transparent py-2.5 text-sm text-text placeholder:text-text-muted outline-none"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-[#c9a15a] px-6 py-2.5 text-sm font-semibold text-[#1a1610] transition-colors hover:bg-[#dab676]"
          >
            Cari
          </button>
        </form>

        <div className="mt-10 flex divide-x divide-[rgba(201,161,90,0.18)]">
          {STATS.map((stat) => (
            <div key={stat.label} className="pr-8 pl-8 first:pl-0">
              <div className="font-heading text-2xl font-semibold text-[#dfc48f]">
                {stat.value}
                {stat.label.startsWith("Rating") && (
                  <span className="ml-1 text-sm italic text-text-muted">/ 5</span>
                )}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right visual — refined framed mark */}
      <div className="relative w-full md:flex-1">
        <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(201,161,90,0.10),transparent_70%)]" />
        <div className="relative mx-auto max-w-md rounded-2xl border border-[rgba(201,161,90,0.25)] bg-surface/60 p-1.5">
          <div className="relative overflow-hidden rounded-xl border border-[rgba(201,161,90,0.35)] px-8 py-14 text-center">
            <div className="absolute left-6 top-6 h-px w-10 bg-[rgba(201,161,90,0.5)]" />
            <div className="absolute right-6 top-6 h-px w-10 bg-[rgba(201,161,90,0.5)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-text-muted">
              NEXORA GAME
            </span>
            <div className="font-display mt-6 text-5xl font-semibold italic leading-none text-[#dfc48f]">
              Instant
            </div>
            <div className="font-display mt-2 text-3xl font-semibold tracking-wide text-text">TopUp</div>
            <div className="mx-auto mt-6 h-px w-24 bg-[rgba(201,161,90,0.5)]" />
            <p className="mt-5 text-xs leading-relaxed text-text-muted">
              Proses instan, harga termurah,
              <br />
              untuk para gamer Indonesia.
            </p>
            <div className="absolute bottom-6 left-6 h-px w-10 bg-[rgba(201,161,90,0.5)]" />
            <div className="absolute bottom-6 right-6 h-px w-10 bg-[rgba(201,161,90,0.5)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
