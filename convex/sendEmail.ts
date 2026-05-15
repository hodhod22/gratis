import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendContactEmail = action({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("📧 Skickar email till dig...");
    console.log("Från:", args.name);
    console.log("Email:", args.email);
    console.log("Meddelande:", args.message);

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error(
        "❌ RESEND_API_KEY is not set in Convex environment variables!",
      );
      return { success: false, error: "No API key" };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: ["DIN_EMAIL_HAR@example.com"], // ← ÄNDRA TILL DIN EMAIL!
          subject: `Nytt meddelande från ${args.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h1 style="color: #2563eb;">📬 Nytt meddelande från din portfolio!</h1>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Från:</strong> ${args.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${args.email}">${args.email}</a></p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <h3>💬 Meddelande:</h3>
                <p>${args.message}</p>
              </div>
              
              <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                Du kan svara direkt på detta mejl för att kontakta ${args.name}.
              </p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("❌ Resend error:", error);
        return { success: false, error };
      }

      console.log("✅ Email skickad!");
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      return { success: false, error: String(error) };
    }
  },
});
