"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

async function sendToAdmin(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) {
    return { success: false as const, error: "missing_config" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "FreeWebDev <onboarding@resend.dev>",
      to: [adminEmail],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    return { success: false as const, error: await response.text() };
  }
  return { success: true as const };
}

export const notifyAdminNewRequest = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    websiteType: v.string(),
    description: v.string(),
  },
  handler: async (_ctx, args) => {
    return sendToAdmin(
      `Ny förfrågan: ${args.name}`,
      `
        <h2>Ny förfrågan om gratis hemsida</h2>
        <p><strong>Namn:</strong> ${args.name}</p>
        <p><strong>E-post:</strong> ${args.email}</p>
        <p><strong>Typ:</strong> ${args.websiteType}</p>
        <p><strong>Beskrivning:</strong></p>
        <p>${args.description.replace(/\n/g, "<br>")}</p>
        <p><a href="${process.env.SITE_URL ?? ""}/admin">Öppna admin-panelen</a></p>
      `,
    );
  },
});

export const notifyAdminNewChatMessage = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    const preview = args.message.slice(0, 200);
    return sendToAdmin(
      `Nytt chattmeddelande från ${args.name}`,
      `
        <h2>Nytt meddelande i live-chatten</h2>
        <p><strong>Från:</strong> ${args.name} (${args.email})</p>
        <p>${preview.replace(/\n/g, "<br>")}</p>
        <p><a href="${process.env.SITE_URL ?? ""}/admin">Öppna admin-panelen</a></p>
      `,
    );
  },
});
