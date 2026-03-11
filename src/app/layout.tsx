import type { Metadata } from "next";
import { Manrope, Geist_Mono, Space_Mono, Instrument_Serif, DM_Mono, Syne, Cormorant_Garamond } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { OgLogo } from "@/components/og-logo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOTI Family",
  description: "We organize 1-week houses for people who builds things",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "SOTI Family",
    description: "We organize 1-week houses for people who builds things",
    url: "https://www.soti.house",
    images: [
      {
        url: "https://www.soti.house/events/barcelona-social.png",
        width: 1200,
        height: 630,
        alt: "SOTI Family",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOTI Family",
    description: "We organize 1-week houses for people who builds things",
    images: ["https://www.soti.house/events/barcelona-social.png"],
  },
  other: {
    "og:logo": "https://www.soti.house/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${geistMono.variable} ${spaceMono.variable} ${instrumentSerif.variable} ${dmMono.variable} ${syne.variable} ${cormorantGaramond.variable} antialiased bg-black`}
        style={{ overflowX: 'hidden' }}
      >
        <OgLogo />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
