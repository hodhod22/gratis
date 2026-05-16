import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWidgets from "@/components/ClientWidgets";
import GlobalSound from "@/components/GlobalSound";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FreeWebDev | Gratis Hemsidor",
  description: "Jag bygger gratis hemsidor för alla - helt utan kostnad",
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
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ClientWidgets />
            <GlobalSound />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
