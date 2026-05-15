import { NextResponse } from "next/server";
import Stripe from "stripe";

// Använd den senaste API-versionen
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: Request) {
  try {
    const { amount, donorName, donorEmail, message } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "sek",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        donor_name: donorName || "Anonymous",
        donor_email: donorEmail || "no-email@example.com",
        message: message || "",
        donation_amount: amount.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment failed" },
      { status: 500 },
    );
  }
}
