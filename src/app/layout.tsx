import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SideCart from "@/components/SideCart";
import Footer from "@/components/Footer";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dulce | Premier Cafe & Restaurant",
  description:
    "An exclusive hideaway. Hand-laminated pastries, single-origin coffee, and unforgettable brunch experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${bricolage.variable} ${caveat.variable} ${playfair.variable} ${dmSans.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen relative">{children}</main>
        <SideCart />
        <Footer />
      </body>
    </html>
  );
}
