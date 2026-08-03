import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardSidebar, type DashboardSidebarItem } from "@/components/layout/DashboardSidebar";

const ITEMS: DashboardSidebarItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/riwayat", label: "Riwayat Transaksi", icon: "History" },
  { href: "/dashboard/deposit", label: "Deposit Saldo", icon: "Wallet" },
  { href: "/dashboard/profil", label: "Profil", icon: "User" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:px-8">
      <DashboardSidebar items={ITEMS} title={`Halo, ${session.user.name?.split(" ")[0] ?? "Member"}`} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
