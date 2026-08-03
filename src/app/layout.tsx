import type { Metadata } from "next";
import { Poppins, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteScope } from "@/components/SiteScope";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NEXORA GAME — TopUp Game Instan, Murah, & Terpercaya",
  description:
    "Top up Diamonds, UC, dan voucher game favoritmu dalam hitungan detik. Aman, terpercaya, harga bersahabat buat gamers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <Providers>
          <Navbar />
          <main className="flex flex-1 flex-col">
            <SiteScope>{children}</SiteScope>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
