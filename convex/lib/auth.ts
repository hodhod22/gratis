import type { MutationCtx, QueryCtx } from "../_generated/server";

type AuthCtx = QueryCtx | MutationCtx;

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
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!adminEmail || email !== adminEmail) {
    throw new Error("Endast administratör har åtkomst");
  }
  return email;
}

export async function requireUserOrAdmin(
  ctx: AuthCtx,
  targetEmail: string,
): Promise<string> {
  const email = await requireAuth(ctx);
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (email === targetEmail.toLowerCase() || email === adminEmail) {
    return email;
  }
  throw new Error("Du får bara läsa din egen chatt");
}
