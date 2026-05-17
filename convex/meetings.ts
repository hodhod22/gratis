// convex/meetings.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Boka ett möte
export const bookMeeting = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    date: v.string(),
    time: v.string(),
    meetingType: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const meetingId = await ctx.db.insert("meetings", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { success: true, meetingId };
  },
});

// Hämta alla möten (admin)
export const getAllMeetings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("getAllMeetings - Identity:", identity?.email);

    // Tillåt endast admin att se möten
    if (!identity?.email || identity.email !== "ezadkhahaali@gmail.com") {
      console.log("Inte admin, returnerar tom array");
      return [];
    }

    const meetings = await ctx.db.query("meetings").order("desc").collect();
    console.log("Hittade möten:", meetings.length);
    return meetings;
  },
});

// Uppdatera mötesstatus
export const updateMeetingStatus = mutation({
  args: {
    id: v.id("meetings"),
    status: v.string(),
    meetingLink: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("updateMeetingStatus - Identity:", identity?.email);

    if (!identity?.email || identity.email !== "ezadkhahaali@gmail.com") {
      throw new Error("Endast admin kan uppdatera möten");
    }

    console.log("Uppdaterar möte:", args.id, "till status:", args.status);

    await ctx.db.patch(args.id, {
      status: args.status,
      meetingLink: args.meetingLink,
      adminNotes: args.adminNotes,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Avboka möte
export const cancelMeeting = mutation({
  args: {
    id: v.id("meetings"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("cancelMeeting - Identity:", identity?.email);

    if (!identity?.email || identity.email !== "ezadkhahaali@gmail.com") {
      throw new Error("Endast admin kan avboka möten");
    }

    const meeting = await ctx.db.get(args.id);
    if (!meeting) throw new Error("Mötet hittades inte");

    await ctx.db.patch(args.id, {
      status: "cancelled",
      adminNotes: args.reason
        ? `Avbokades: ${args.reason}`
        : meeting.adminNotes,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Markera möte som genomfört
export const completeMeeting = mutation({
  args: {
    id: v.id("meetings"),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("completeMeeting - Identity:", identity?.email);

    if (!identity?.email || identity.email !== "ezadkhahaali@gmail.com") {
      throw new Error("Endast admin kan slutföra möten");
    }

    const meeting = await ctx.db.get(args.id);
    if (!meeting) throw new Error("Mötet hittades inte");

    await ctx.db.patch(args.id, {
      status: "completed",
      adminNotes: args.feedback
        ? `Genomfört: ${args.feedback}`
        : meeting.adminNotes,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
