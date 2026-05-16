import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FreeWebDev",
    short_name: "FreeWebDev",
    description: "Gratis hemsidor för alla - byggt med Next.js och TypeScript",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [],
  };
}
