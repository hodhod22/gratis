"use client";

import { useUser } from "@clerk/nextjs";
import ChatWidget from "./ChatWidget";
import AdminHeartbeat from "./AdminHeartbeat";

export default function ClientWidgets() {
  const { isSignedIn, user } = useUser();
  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ezadkhahaali@gmail.com";
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  return (
    <>
      {!isAdmin && <ChatWidget />}
      <AdminHeartbeat />
    </>
  );
}
