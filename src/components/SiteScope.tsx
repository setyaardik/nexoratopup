"use client";

import { usePathname } from "next/navigation";

export function SiteScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return <div className={isAdmin ? "flex flex-1 flex-col" : "site"}>{children}</div>;
}
