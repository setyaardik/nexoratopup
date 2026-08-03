"use client";

import Link from "next/link";
import { MessageCircle, Mail, AtSign } from "lucide-react";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";

function AdminFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <span className="font-heading gradient-text text-lg font-extrabold">NexoraGame</span>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Platform top up game tercepat &amp; terpercaya di Indonesia.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-text">Navigasi</h4>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li><Link href="/" className="hover:text-text">Home</Link></li>
            <li><Link href="/promo" className="hover:text-text">Promo</Link></li>
            <li><Link href="/cek-transaksi" className="hover:text-text">Cek Transaksi</Link></li>
            <li><Link href="/reseller" className="hover:text-text">Reseller</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-text">Akun</h4>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li><Link href="/auth/login" className="hover:text-text">Masuk</Link></li>
            <li><Link href="/auth/register" className="hover:text-text">Daftar</Link></li>
            <li><Link href="/dashboard" className="hover:text-text">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-text">Kontak</h4>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li className="flex items-center gap-2"><MessageCircle className="size-4" /> WhatsApp CS</li>
            <li className="flex items-center gap-2"><Mail className="size-4" /> support@nexoragame.id</li>
            <li className="flex items-center gap-2"><AtSign className="size-4" /> @nexoragame.id</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(201,161,90,0.16)] bg-[#0d0c0a] px-4 pb-10 pt-14 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-semibold tracking-wide text-[#f2ede2]">Nexora</span>
            <span className="font-display text-xl font-semibold italic tracking-wide text-[#c9a15a]">Game</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#a39a89]">
            Platform top up game tercepat &amp; terpercaya di Indonesia. Setiap transaksi diproses dengan aman dan
            instan.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a15a]">Navigasi</h4>
          <ul className="flex flex-col gap-3 text-sm text-[#a39a89]">
            <li><Link href="/" className="transition-colors hover:text-[#f2ede2]">Home</Link></li>
            <li><Link href="/promo" className="transition-colors hover:text-[#f2ede2]">Promo</Link></li>
            <li><Link href="/cek-transaksi" className="transition-colors hover:text-[#f2ede2]">Cek Transaksi</Link></li>
            <li><Link href="/reseller" className="transition-colors hover:text-[#f2ede2]">Reseller</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a15a]">Akun</h4>
          <ul className="flex flex-col gap-3 text-sm text-[#a39a89]">
            <li><Link href="/auth/login" className="transition-colors hover:text-[#f2ede2]">Masuk</Link></li>
            <li><Link href="/auth/register" className="transition-colors hover:text-[#f2ede2]">Daftar</Link></li>
            <li><Link href="/dashboard" className="transition-colors hover:text-[#f2ede2]">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c9a15a]">Kontak</h4>
          <ul className="flex flex-col gap-3 text-sm text-[#a39a89]">
            <li className="flex items-center gap-2.5"><MessageCircle className="size-4 text-[#c9a15a]" /> WhatsApp CS</li>
            <li className="flex items-center gap-2.5"><Mail className="size-4 text-[#c9a15a]" /> support@nexoragame.id</li>
            <li className="flex items-center gap-2.5"><AtSign className="size-4 text-[#c9a15a]" /> @nexoragame.id</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-[rgba(201,161,90,0.14)] pt-6 text-center text-xs tracking-wide text-[#a39a89]">
        &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}

export function Footer() {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? <AdminFooter /> : <SiteFooter />;
}
