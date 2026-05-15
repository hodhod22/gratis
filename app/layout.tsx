import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import StructuredData from "@/components/StructuredData";
import { allKeywords } from "@/lib/keywords";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FreeWebDev | Gratis Hemsidor för Alla",
    template: "%s | FreeWebDev",
  },
  description:
    "Jag bygger gratis hemsidor för privatpersoner, företag och organisationer. Helt gratis - ingen dold kostnad. Donationer är frivilliga. Next.js, TypeScript, modern webbdesign.",
  keywords:allKeywords,
  authors: [{ name: "Cecilia Wiklund", url: "https://freewebdev.se" }],
  creator: "Cecilia Wiklund",
  publisher: "FreeWebDev",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://freewebdev.se",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FreeWebDev - Gratis Hemsidor för Alla",
    description:
      "Jag bygger gratis hemsidor. Ingen kostnad, inga dolda avgifter. Donationer frivilliga. Perfekt för småföretag, startup, ideella föreningar och privatpersoner.",
    url: "/",
    siteName: "FreeWebDev",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FreeWebDev - Gratis Hemsidor för Alla",
      },
    ],
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeWebDev - Gratis Hemsidor för Alla",
    description:
      "Jag bygger gratis hemsidor. Ingen kostnad, inga dolda avgifter. Donationer frivilliga.",
    images: ["/og-image.jpg"],
    creator: "@freewebdev",
    site: "@freewebdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="sv" suppressHydrationWarning>
        <head>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              />
              <script
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
        <body className={inter.className}>
          <StructuredData
            type="Person"
            data={{
              name: "Cecilia Wiklund",
              jobTitle: "Webbutvecklare",
              description:
                "Bygger gratis hemsidor för privatpersoner, företag, ideella föreningar och organisationer",
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://freewebdev.se",
              sameAs: [
                "https://github.com/dittanvandarnamn",
                "https://linkedin.com/in/dittnamn",
              ],
              knowsAbout: [
                "Next.js",
                "TypeScript",
                "React",
                "Tailwind CSS",
                "Web Development",
                "SEO",
                "Responsive Design",
              ],
            }}
          />
          <StructuredData
            type="Service"
            data={{
              name: "Gratis Hemsida",
              description:
                "Jag bygger din hemsida helt gratis. Ingen kostnad, inga dolda avgifter. Perfekt för småföretag, startups, ideella föreningar och privatpersoner.",
              provider: {
                "@type": "Person",
                name: "Cecilia Wiklund",
              },
              areaServed: {
                "@type": "Country",
                name: "Sverige",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Webbutvecklingstjänster",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Gratis hemsida",
                      description:
                        "Komplett gratis hemsida byggd med modern teknik",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Gratis portfolio",
                      description:
                        "Professionell portfolio för konstnärer, fotografer, designers",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Gratis företagshemsida",
                      description:
                        "Modern företagshemsida för små och medelstora företag",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Gratis e-handel",
                      description: "Enkel e-handelslösning för startups",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Gratis blogg",
                      description: "Professionell bloggplattform",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Gratis landningssida",
                      description: "Konverteringsoptimerad landningssida",
                    },
                  },
                ],
              },
              audience: {
                "@type": "Audience",
                name: "Småföretag, startups, ideella föreningar, privatpersoner",
              },
              funding: {
                "@type": "Donation",
                name: "Frivilliga donationer via Stripe och Swish",
              },
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
