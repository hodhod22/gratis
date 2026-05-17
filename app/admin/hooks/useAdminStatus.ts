// app/admin/hooks/useAdminStatus.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function useAdminStatus() {
  const adminStatus = useQuery(api.adminStatus.getMyAdminStatus);
  const updateAdminStatus = useMutation(api.adminStatus.updateAdminStatus);
  const adminPing = useMutation(api.adminStatus.adminPing);

  useEffect(() => {
    // Set online when component mounts
    updateAdminStatus({ isOnline: true });

    // Ping every 30 seconds to stay online
    const interval = setInterval(() => {
      adminPing();
    }, 30000);

    // Set offline when component unmounts
    const handleBeforeUnload = () => {
      updateAdminStatus({ isOnline: false });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updateAdminStatus({ isOnline: false });
    };
  }, [updateAdminStatus, adminPing]);

  return {
    isAdmin: adminStatus?.isAdmin ?? false,
    isLoggedIn: adminStatus?.isLoggedIn ?? false,
    email: adminStatus?.email ?? null,
    name: adminStatus?.name ?? null,
    isOnline: adminStatus?.isOnline ?? false,
    lastActive: adminStatus?.lastActive ?? null,
    lastSeen: adminStatus?.lastSeen ?? null,
  };
}
