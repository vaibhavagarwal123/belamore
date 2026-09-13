"use server";

import { redirect } from "next/navigation";
import crypto from "crypto";
import { db } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createAdminSession,
  clearAdminSession,
  requireAdmin,
  anyAdminExists,
} from "@/lib/admin-auth";
import { sendMail, isEmailConfigured } from "@/lib/email";

export type ActionState = { error?: string; success?: string } | null;

export async function setupAdminAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (await anyAdminExists()) {
    redirect("/admin/login");
  }
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !email || password.length < 8) {
    return { error: "Please fill all fields — password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const admin = await db.adminUser.create({
    data: { name, email, passwordHash: await hashPassword(password) },
  });
  await createAdminSession(admin.id, admin.email);
  redirect("/admin");
}

export async function loginAdminAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");

  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return { error: "Incorrect email or password." };
  }
  await createAdminSession(admin.id, admin.email);
  redirect("/admin");
}

export async function logoutAdminAction() {
  clearAdminSession();
  redirect("/admin/login");
}

export async function requestAdminPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const admin = await db.adminUser.findUnique({ where: { email } });

  // Always behave the same way whether or not the account exists, so we
  // don't leak which emails have admin access.
  if (admin) {
    const token = crypto.randomBytes(32).toString("hex");
    await db.adminUser.update({
      where: { id: admin.id },
      data: { resetToken: token, resetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60) },
    });
    const link = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/reset-password?token=${token}`;

    if (isEmailConfigured()) {
      await sendMail({
        to: admin.email,
        subject: "Reset your Belamore admin password",
        text: `Reset your password here (valid 1 hour): ${link}`,
      }).catch(() => {});
    } else {
      console.log(`\n[Belamore admin] Password reset link for ${admin.email}:\n${link}\n`);
    }
  }

  return {
    success: isEmailConfigured()
      ? "If that email has admin access, a reset link has been sent."
      : "Email isn't configured on this server yet — ask whoever manages the server to run `npm run admin:reset-password`, or check the server logs for a direct reset link.",
  };
}

export async function resetAdminPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const admin = await db.adminUser.findFirst({ where: { resetToken: token } });
  if (!admin || !admin.resetTokenExpiresAt || admin.resetTokenExpiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired. Please request a new one." };
  }

  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: await hashPassword(password), resetToken: null, resetTokenExpiresAt: null },
  });

  redirect("/admin/login");
}

export async function changeAdminPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!(await verifyPassword(currentPassword, admin!.passwordHash))) {
    return { error: "Current password is incorrect." };
  }
  if (newPassword.length < 8) return { error: "New password must be at least 8 characters." };
  if (newPassword !== confirmPassword) return { error: "New passwords do not match." };

  await db.adminUser.update({
    where: { id: admin!.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  return { success: "Password updated successfully." };
}

export async function requireAdminOrRedirect() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
