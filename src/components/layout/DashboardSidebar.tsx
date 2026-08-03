"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, History, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  LayoutDashboard,
  History,
  Wallet,
  User,
} as const;

export type DashboardSidebarIconName = keyof typeof ICON_MAP;

export interface DashboardSidebarItem {
  href: string;
  label: string;
  icon: DashboardSidebarIconName;
}

export function DashboardSidebar({ items, title }: { items: DashboardSidebarItem[]; title: string }) {
  const pathname = usePathname();

  return (
    <aside className="card-surface flex h-fit w-full flex-col gap-1 rounded-2xl p-5 md:w-64 md:shrink-0">
      <div className="mb-3 flex items-baseline gap-1 px-1">
        <span className="font-display text-lg font-semibold tracking-wide text-text">Nexora</span>
        <span className="font-display text-lg font-semibold italic tracking-wide text-[#c9a15a]">Game</span>
      </div>
      <div className="mb-4 border-t border-[rgba(201,161,90,0.14)] pt-4 px-1 text-xs text-text-muted">{title}</div>
      {items.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "border border-[rgba(201,161,90,0.45)] bg-[rgba(201,161,90,0.08)] text-[#dfc48f]"
                : "border border-transparent text-text-muted hover:bg-white/5 hover:text-text"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-danger hover:bg-danger/10"
      >
        <LogOut className="size-4" />
        Keluar
      </button>
    </aside>
  );
}
