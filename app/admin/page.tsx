import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export const metadata = {
  title: "Admin | Portfolio",
  description: "Admin panel för att hantera meddelanden och förfrågningar",
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  if (!ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL is not set in .env.local");
    redirect("/");
  }

  // Hämta användarens email från Clerk
  let userEmail = null;
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    const userData = await response.json();
    userEmail = userData.email_addresses?.[0]?.email_address;
  } catch (error) {
    console.error("Failed to fetch user email:", error);
    redirect("/");
  }

  if (userEmail !== ADMIN_EMAIL) {
    redirect("/");
  }

  return <AdminClient adminEmail={ADMIN_EMAIL} />;
}
