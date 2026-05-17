// app/lib/adminCheck.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Admin e-postadresser (samma som i backend)
const ADMIN_EMAILS = ["ezadkhahaali@gmail.com"];

// Hook för att kolla om nuvarande användare är admin
export function useIsAdmin() {
  const adminStatus = useQuery(api.adminStatus.getMyAdminStatus);
  return adminStatus?.isAdmin ?? false;
}

// Hook för att få full admin-status (med alla detaljer)
export function useAdminStatus() {
  const adminStatus = useQuery(api.adminStatus.getMyAdminStatus);

  // Returnera ett default objekt om status inte är laddad än
  if (!adminStatus) {
    return {
      isAdmin: false,
      isLoggedIn: false,
      email: null,
      name: null,
      isOnline: false,
      lastActive: null,
      lastSeen: null,
    };
  }

  return {
    isAdmin: adminStatus.isAdmin ?? false,
    isLoggedIn: adminStatus.isLoggedIn ?? false,
    email: adminStatus.email ?? null,
    name: adminStatus.name ?? null,
    isOnline: adminStatus.isOnline ?? false,
    lastActive: adminStatus.lastActive ?? null,
    lastSeen: adminStatus.lastSeen ?? null,
  };
}

// Hook för att kolla om admin är online (för användare)
export function useAdminOnline() {
  const adminStatus = useQuery(api.adminStatus.getAdminStatus);
  return adminStatus?.isOnline ?? false;
}

// Hjälpfunktion för att kolla admin-status på serversidan
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Exportera admin emails för användning i andra filer
export { ADMIN_EMAILS };
