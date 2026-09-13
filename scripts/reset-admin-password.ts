/**
 * Fallback admin password reset, run directly on the server:
 *   npm run admin:reset-password -- admin@example.com NewPassword123
 * Useful if email isn't configured and the owner is locked out.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const db = new PrismaClient();

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
}

async function main() {
  const [, , argEmail, argPassword] = process.argv;
  const email = (argEmail || (await ask("Admin email: "))).toLowerCase().trim();
  const password = argPassword || (await ask("New password (min 8 chars): "));

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await db.adminUser.findUnique({ where: { email } });

  if (admin) {
    await db.adminUser.update({ where: { email }, data: { passwordHash } });
    console.log(`Password updated for ${email}.`);
  } else {
    await db.adminUser.create({ data: { email, name: "Admin", passwordHash } });
    console.log(`No admin existed for ${email} — created a new admin account.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
