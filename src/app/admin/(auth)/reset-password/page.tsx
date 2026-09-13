import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export const dynamic = "force-dynamic";

export default function AdminResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <ResetPasswordForm token={searchParams.token ?? ""} />;
}
