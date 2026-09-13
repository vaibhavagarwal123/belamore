import { requireAdminOrRedirect } from "@/lib/admin-actions";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminOrRedirect();

  return (
    <div className="flex min-h-screen bg-beige-100/40">
      <AdminSidebar adminName={admin.name} />
      <main className="flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  );
}
