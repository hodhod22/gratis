// convex/lib/auth.ts
import type { MutationCtx, QueryCtx } from "../_generated/server";

type AuthCtx = QueryCtx | MutationCtx;

// 🆕 Admin e-postadresser (hårdkodade för att alltid fungera)
const ADMIN_EMAILS = [
  "ezadkhahaali@gmail.com",
  // Lägg till fler admin emails här vid behov
];

// 🆕 Hjälpfunktion för att kolla om en email är admin
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const lowerEmail = email.toLowerCase();
  return ADMIN_EMAILS.includes(lowerEmail);
}

export async function getAuthEmail(ctx: AuthCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.email?.toLowerCase() ?? null;
}

export async function requireAuth(ctx: AuthCtx): Promise<string> {
  const email = await getAuthEmail(ctx);
  if (!email) {
    throw new Error("Du måste vara inloggad");
  }
  return email;
}

export async function requireAdmin(ctx: AuthCtx): Promise<string> {
  const email = await requireAuth(ctx);

  // 🆕 Kolla mot hårdkodade admin emails istället för environment variable
  if (!isAdminEmail(email)) {
    throw new Error("Endast administratör har åtkomst");
  }

  return email;
}

// 🆕 Alternativ: requireAdmin med extra säkerhet (kollar både env och hårdkodad)
export async function requireAdminStrict(ctx: AuthCtx): Promise<string> {
  const email = await requireAuth(ctx);

  // Kolla mot environment variable (om den finns)
  const envAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  // Kolla mot hårdkodade admin emails
  const isHardcodedAdmin = isAdminEmail(email);
  const isEnvAdmin = envAdminEmail ? email === envAdminEmail : false;

  if (!isHardcodedAdmin && !isEnvAdmin) {
    throw new Error("Endast administratör har åtkomst");
  }

  return email;
}

export async function requireUserOrAdmin(
  ctx: AuthCtx,
  targetEmail: string,
): Promise<string> {
  const email = await requireAuth(ctx);

  // 🆕 Uppdaterad admin-check
  const isAdmin = isAdminEmail(email);

  if (email === targetEmail.toLowerCase() || isAdmin) {
    return email;
  }

  throw new Error("Du får bara läsa din egen chatt");
}

// 🆕 Hjälpfunktion för att få användarinformation med admin-status
export async function getAuthUser(ctx: AuthCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity || !identity.email) {
    return null;
  }

  const email = identity.email.toLowerCase();

  return {
    email: email,
    name: identity.name || email.split("@")[0],
    isAdmin: isAdminEmail(email),
    tokenIdentifier: identity.tokenIdentifier,
  };
}

// 🆕 Funktion för att kolla admin-status utan att throwa error
export async function checkAdminStatus(ctx: AuthCtx): Promise<boolean> {
  try {
    const email = await getAuthEmail(ctx);
    return isAdminEmail(email);
  } catch {
    return false;
  }
}
