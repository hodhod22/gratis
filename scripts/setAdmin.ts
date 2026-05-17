// scripts/setAdmin.ts (kör med: npx tsx scripts/setAdmin.ts)
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function setAdmin() {
  try {
    // Detta är bara för utveckling - i produktion bör du ha en säker metod
    const result = await convex.mutation(api.adminSetup.setupAdmin, {
      email: "ezadkhahaali@gmail.com",
      name: "Admin User",
    });

    console.log("Admin setup result:", result);
  } catch (error) {
    console.error("Fel:", error);
  }
}

setAdmin();
