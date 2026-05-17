// convex/adminStatus.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Admin e-postadresser
const ADMIN_EMAILS = ["ezadkhahaali@gmail.com"];

// Hjälpfunktion för att kolla admin-status
async function isAdminUser(ctx: any): Promise<boolean> {
  try {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.email) return false;
    return ADMIN_EMAILS.includes(identity.email.toLowerCase());
  } catch {
    return false;
  }
}

// Uppdatera admin-status (online/offline)
export const updateAdminStatus = mutation({
  args: { isOnline: v.boolean() },
  handler: async (ctx, args) => {
    const isAdmin = await isAdminUser(ctx);

    if (!isAdmin) {
      console.log("Non-admin user tried to update admin status");
      return { success: false, message: "Not authorized" };
    }

    const existing = await ctx.db.query("adminStatus").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isOnline: args.isOnline,
        lastSeen: Date.now(),
        lastActive: Date.now(),
      });
    } else {
      await ctx.db.insert("adminStatus", {
        isOnline: args.isOnline,
        lastSeen: Date.now(),
        lastActive: Date.now(),
      });
    }

    return { success: true };
  },
});

// Hämta admin-status (offentlig - vem som helst kan se)
export const getAdminStatus = query({
  handler: async (ctx) => {
    const status = await ctx.db.query("adminStatus").first();
    if (!status) {
      return { isOnline: false };
    }
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const isOnline = status.isOnline && status.lastActive > twoMinutesAgo;
    return { isOnline, lastActive: status.lastActive };
  },
});

// 🆕 Uppdaterad: Hämta min admin-status (för inloggad användare)
export const getMyAdminStatus = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        isAdmin: false,
        isLoggedIn: false,
        email: null,
        name: null,
        isOnline: false,
        lastActive: null,
        lastSeen: null,
      };
    }

    const isAdmin = ADMIN_EMAILS.includes(identity.email?.toLowerCase() || "");
    const status = await ctx.db.query("adminStatus").first();

    // Beräkna online-status baserat på lastActive
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    const isOnline =
      status?.isOnline && (status?.lastActive || 0) > twoMinutesAgo;

    return {
      isAdmin: isAdmin,
      isLoggedIn: true,
      email: identity.email,
      name: identity.name,
      isOnline: isOnline,
      lastActive: status?.lastActive || null,
      lastSeen: status?.lastSeen || null,
    };
  },
});

// Admin ping - håller admin online-status aktiv
export const adminPing = mutation({
  handler: async (ctx) => {
    const isAdmin = await isAdminUser(ctx);
    if (!isAdmin) return { success: false };

    const existing = await ctx.db.query("adminStatus").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastActive: Date.now(),
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert("adminStatus", {
        isOnline: true,
        lastSeen: Date.now(),
        lastActive: Date.now(),
      });
    }

    return { success: true };
  },
});

// Sätt admin offline (används vid logout)
export const setAdminOffline = mutation({
  handler: async (ctx) => {
    const isAdmin = await isAdminUser(ctx);
    if (!isAdmin) return { success: false };

    const existing = await ctx.db.query("adminStatus").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isOnline: false,
        lastSeen: Date.now(),
      });
    }

    return { success: true };
  },
});

// Kolla om nuvarande användare är admin (returnerar boolean)
export const amIAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return false;
    return ADMIN_EMAILS.includes(identity.email.toLowerCase());
  },
});
