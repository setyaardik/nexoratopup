"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, History, Wallet, User, Package, Receipt, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  LayoutDashboard,
  History,
  Wallet,
  User,
  Package,
  Receipt,
  Settings,
} as const;

export type SidebarIconName = keyof typeof ICON_MAP;

export interface SidebarItem {
  href: string;
  label: string;
  icon: SidebarIconName;
}

export function Sidebar({ items, title }: { items: SidebarItem[]; title: string }) {
  const pathname = usePathname();

  return (
    <aside className="card-surface flex h-fit w-full flex-col gap-1 rounded-2xl p-4 md:w-60 md:shrink-0">
      <div className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-text-muted">{title}</div>
      {items.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "gradient-bg text-white" : "text-text-muted hover:bg-white/5 hover:text-text"
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
