import { redirect } from "next/navigation";
import { anyAdminExists, getAdminSession } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (!(await anyAdminExists())) redirect("/admin/setup");
  if (await getAdminSession()) redirect("/admin");
  return <LoginForm />;
}
