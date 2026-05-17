// convex/adminSetup.ts
import { mutation, query } from "./_generated/server"; // 🆕 Lägg till 'query' här!
import { v } from "convex/values";

// Admin e-postadresser - lägg till din email här!
const ADMIN_EMAILS = [
  "ezadkhahaali@gmail.com",
  // Lägg till fler admin emails här vid behov
];

export const setupAdmin = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Du måste vara inloggad");
    }

    const userEmail = identity.email ?? args.email;
    const isAdmin = ADMIN_EMAILS.includes(userEmail);

    // Kolla om användaren redan finns
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (existingUser) {
      // Uppdatera befintlig användare
      await ctx.db.patch(existingUser._id, {
        email: userEmail,
        name: args.name ?? identity.name ?? userEmail,
        isAdmin: isAdmin,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        message: `Admin-status uppdaterad: ${isAdmin}`,
        isAdmin: isAdmin,
      };
    } else {
      // Skapa ny användare
      await ctx.db.insert("users", {
        tokenIdentifier: identity.tokenIdentifier,
        email: userEmail,
        name: args.name ?? identity.name ?? userEmail,
        isAdmin: isAdmin,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return {
        success: true,
        message: `Användare skapad med admin-status: ${isAdmin}`,
        isAdmin: isAdmin,
      };
    }
  },
});

// Query för att hämta admin-status
export const getAdminStatus = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return { isAdmin: false, isLoggedIn: false, email: null };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    const userEmail = identity.email;
    const isAdminByEmail = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;

    return {
      isAdmin: user?.isAdmin ?? isAdminByEmail,
      isLoggedIn: true,
      email: userEmail,
      userId: identity.subject,
      name: user?.name ?? identity.name,
    };
  },
});
