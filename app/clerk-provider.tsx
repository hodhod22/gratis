"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
