import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "FreeWebDev | Gratis Hemsidor för Alla",
    template: "%s | FreeWebDev",
  },
  description:
    "Jag bygger gratis hemsidor för privatpersoner, företag och organisationer. Helt gratis - ingen dold kostnad.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://freewebdev.se",
  ),
  openGraph: {
    title: "FreeWebDev - Gratis Hemsidor för Alla",
    description:
      "Jag bygger gratis hemsidor. Ingen kostnad, inga dolda avgifter.",
    locale: "sv_SE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html
        lang="sv"
        className={`${inter.variable} ${jetbrainsMono.variable}`}
        suppressHydrationWarning
      >
        <head>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                  `,
                }}
              />
            </>
          )}
        </head>
        <body className="antialiased">
          <StructuredData
            type="Person"
            data={{
              name: "Cecilia Wiklund",
              jobTitle: "Webbutvecklare",
              description: "Bygger gratis hemsidor",
              url: process.env.NEXT_PUBLIC_BASE_URL,
            }}
          />
          <Providers>
            <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ChatWidget />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
