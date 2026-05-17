// app/components/AdminGuard.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded: authLoaded } = useAuth();
  const adminStatus = useQuery(api.adminStatus.getMyAdminStatus);

  if (!authLoaded || adminStatus === undefined) {
    return <div>Laddar...</div>;
  }

  if (!userId || !adminStatus.isAdmin) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Åtkomst nekad</h2>
        <p className="mt-2">Du måste vara admin för att se denna sida.</p>
      </div>
    );
  }

  return <>{children}</>;
}
