import { NextResponse } from "next/server";

// Tillfällig lösning utan Resend - skickar till console
// När du har en Resend API-nyckel, ersätt med riktig email

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validering
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Alla fält måste fyllas i" },
        { status: 400 },
      );
    }

    // Logga meddelandet (i produktion skicka riktigt email)
    console.log(`
      ========================================
      NYTT MEDDELANDE FRÅN PORTFOLIO
      ========================================
      Från: ${name}
      Email: ${email}
      Meddelande:
      ${message}
      ========================================
    `);

    // TODO: När du har en Resend API-nyckel, avkommentera detta:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["din-email@gmail.com"],
      subject: `Nytt meddelande från ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">📬 Nytt meddelande från din portfolio!</h1>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Från:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h3>💬 Meddelande:</h3>
            <p>${message}</p>
          </div>
        </div>
      `,
    });
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
