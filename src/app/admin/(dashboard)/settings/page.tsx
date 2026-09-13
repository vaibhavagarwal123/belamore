import { requireAdminOrRedirect } from "@/lib/admin-actions";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export default async function AdminSettingsPage() {
  const admin = await requireAdminOrRedirect();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-ink-700">Settings</h1>

      <div className="mb-10 rounded-2xl border border-ink-600/10 bg-white p-6">
        <h2 className="mb-1 font-display text-lg text-ink-700">Admin Account</h2>
        <p className="text-sm text-ink-500">{admin.name} · {admin.email}</p>
      </div>

      <div className="rounded-2xl border border-ink-600/10 bg-white p-6">
        <h2 className="mb-4 font-display text-lg text-ink-700">Change Password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
