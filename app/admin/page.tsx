/* import { auth } from "@clerk/nextjs/server";
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
 */
// app/admin/page.tsx
'use client';

import { useAuth } from "@clerk/nextjs";
import { useIsAdmin } from "@/lib/adminCheck";
import AdminClient from "./AdminClient";

export default function AdminPage() {
  const { isLoaded: authLoaded, userId } = useAuth();
  const isAdmin = useIsAdmin();

  if (!authLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-600">Inte inloggad</h2>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⛔</div>
          <h2 className="text-2xl font-bold text-red-600">Åtkomst nekad</h2>
        </div>
      </div>
    );
  }

  return <AdminClient />;
}