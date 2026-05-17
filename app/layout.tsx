import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWidgets from "@/components/ClientWidgets";
import MeetingWidget from "@/components/MeetingWidget";
import { AuthHandler } from "@/components/AuthHandler";
const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://freewebdev.se";

export const metadata = {
  title: "FreeWebDev | Gratis Hemsidor",
  description: "Jag bygger gratis hemsidor för alla - helt utan kostnad",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "FreeWebDev | Gratis Hemsidor",
    description:
      "Moderna, snabba hemsidor helt gratis. Portfolio, chatt och förfrågan online.",
    url: siteUrl,
    siteName: "FreeWebDev",
    locale: "sv_SE",
    type: "website",
    images: [
      {
        url: "/thunderstorm.jpg",
        width: 1200,
        height: 630,
        alt: "FreeWebDev — gratis hemsidor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeWebDev | Gratis Hemsidor",
    description: "Jag bygger gratis hemsidor för alla - helt utan kostnad",
    images: ["/thunderstorm.jpg"],
  },
  icons: {
    icon: "/thunderstorm.jpg",
    apple: "/thunderstorm.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="sv">
        <body className={inter.className}>
          <Providers>
            <Header />
            <main className="min-h-screen">
              <AuthHandler />
              {children}
              {/* <MeetingWidget /> */}
            </main>
            <Footer />
            <ClientWidgets />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
