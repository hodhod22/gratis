"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export default function AdminHeartbeat() {
  const { isSignedIn, user } = useUser();
  const updateAdminStatus = useMutation(api.adminStatus.updateAdminStatus);

  const ADMIN_EMAIL =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ezadkhahaali@gmail.com";
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (!isSignedIn || !isAdmin) return;

    updateAdminStatus({ isOnline: true });
    const interval = setInterval(
      () => updateAdminStatus({ isOnline: true }),
      15000,
    );
    const handleBeforeUnload = () => updateAdminStatus({ isOnline: false });
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updateAdminStatus({ isOnline: false });
    };
  }, [isSignedIn, isAdmin, updateAdminStatus]);

  return null;
}
