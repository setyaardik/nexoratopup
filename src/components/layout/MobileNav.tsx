"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/promo", label: "Promo" },
  { href: "/cek-transaksi", label: "Cek Transaksi" },
  { href: "/reseller", label: "Reseller" },
];

export function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] transition-opacity md:hidden",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "card-surface absolute right-0 top-0 flex h-full w-72 flex-col gap-1 p-6 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-heading gradient-text text-lg font-extrabold">NexoraGame</span>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <X className="size-5" />
          </button>
        </div>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="rounded-lg px-3 py-3 text-sm font-medium text-text hover:bg-white/5"
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-4 border-t border-white/10 pt-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="block rounded-lg px-3 py-3 text-sm font-semibold text-text hover:bg-white/5"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="block w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-text-muted hover:bg-white/5"
              >
                Keluar
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={onClose}
              className="gradient-bg block rounded-xl px-3 py-3 text-center text-sm font-bold text-white"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
