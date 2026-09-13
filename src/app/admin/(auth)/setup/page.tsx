import { redirect } from "next/navigation";
import { anyAdminExists } from "@/lib/admin-auth";
import { SetupForm } from "@/components/admin/setup-form";

export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  if (await anyAdminExists()) redirect("/admin/login");
  return <SetupForm />;
}
