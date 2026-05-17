// app/components/AuthHandler.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function AuthHandler() {
  const { user, isLoaded } = useUser();
  const setupAdmin = useMutation(api.adminSetup.setupAdmin);

  useEffect(() => {
    if (isLoaded && user) {
      // Automatiskt kör setupAdmin när användaren loggar in
      setupAdmin({
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || user.username || undefined,
      }).catch((error) => {
        console.error("Fel vid admin-setup:", error);
      });
    }
  }, [isLoaded, user, setupAdmin]);

  return null; // Denna komponent renderar inget
}
