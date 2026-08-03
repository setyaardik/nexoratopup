import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar, type SidebarItem } from "@/components/layout/Sidebar";

const ITEMS: SidebarItem[] = [
  { href: "/admin", label: "Overview", icon: "LayoutDashboard" },
  { href: "/admin/products", label: "Produk", icon: "Package" },
  { href: "/admin/transactions", label: "Transaksi", icon: "Receipt" },
  { href: "/admin/settings", label: "Pengaturan", icon: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:px-8">
      <Sidebar items={ITEMS} title="Admin Panel" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
