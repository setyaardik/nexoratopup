"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/promo", label: "Promo" },
  { href: "/cek-transaksi", label: "Cek Transaksi" },
  { href: "/reseller", label: "Reseller" },
];

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/* ------------------------------------------------------------------ */
/* Admin keeps the original chrome — untouched.                        */
/* ------------------------------------------------------------------ */
function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[100] flex items-center justify-between gap-4 px-4 py-3.5 transition-colors md:px-8",
          scrolled ? "border-b border-white/10 bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
        )}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading gradient-text text-xl font-extrabold tracking-tight">
            NexoraGame
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-text",
                  pathname === link.href ? "text-text" : "text-text-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-text hover:bg-white/5"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-semibold text-text-muted hover:text-text">
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="gradient-bg rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(108,99,255,0.4)]"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button className="text-text md:hidden" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
          <Menu className="size-6" />
        </button>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* User storefront: simple & luxurious.                                */
/* ------------------------------------------------------------------ */
function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[100] transition-all duration-300",
          scrolled
            ? "border-b border-[rgba(201,161,90,0.16)] bg-[#0d0c0a]/90 backdrop-blur-md"
            : "border-b border-transparent bg-[#0d0c0a]"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="group flex items-baseline gap-1">
            <span className="font-display text-xl font-semibold tracking-wide text-text">Nexora</span>
            <span className="font-display text-xl font-semibold italic tracking-wide text-[#c9a15a]">Game</span>
            <span className="ml-0.5 hidden h-1 w-1 self-center rounded-full bg-[#c9a15a] sm:block" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors",
                    active ? "text-[#dfc48f]" : "text-[#a39a89] hover:text-text"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px bg-[#c9a15a] transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="rounded-lg border border-[rgba(201,161,90,0.4)] px-4 py-2 text-sm font-semibold text-[#dfc48f] transition-colors hover:bg-[rgba(201,161,90,0.08)]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a39a89] transition-colors hover:text-text"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-[#c9a15a] px-5 py-2.5 text-sm font-semibold text-[#1a1610] transition-colors hover:bg-[#dab676]"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          <button
            className="text-text md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[200] transition-opacity md:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-72 flex-col gap-1 bg-[#15120e] p-6 transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="mb-8 flex items-center justify-between border-b border-[rgba(201,161,90,0.15)] pb-5">
            <span className="font-display text-lg font-semibold text-text">
              Nexora<span className="italic text-[#c9a15a]">Game</span>
            </span>
            <button onClick={() => setMobileOpen(false)} className="text-[#a39a89] hover:text-text">
              <X className="size-5" />
            </button>
          </div>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a39a89] transition-colors hover:bg-white/5 hover:text-text"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3 border-t border-[rgba(201,161,90,0.15)] pt-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg border border-[rgba(201,161,90,0.4)] px-3 py-3 text-center text-sm font-semibold text-[#dfc48f]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg bg-[#c9a15a] px-3 py-3 text-center text-sm font-semibold text-[#1a1610]"
                >
                  Masuk
                </Link>
              </>
            ) : (
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg bg-[#c9a15a] px-3 py-3 text-center text-sm font-semibold text-[#1a1610]"
              >
                Daftar
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function Navbar() {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? <AdminNavbar /> : <SiteNavbar />;
}
