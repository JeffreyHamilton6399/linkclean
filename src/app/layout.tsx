import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkClean — Strip tracking from URLs instantly",
  description:
    "Paste a messy URL, get a clean one. LinkClean strips tracking parameters (utm_source, fbclid, gclid, mc_cid…) instantly in your browser. No sign-up, no tracking, 100% free.",
  keywords: [
    "URL cleaner",
    "strip tracking parameters",
    "remove utm",
    "fbclid remover",
    "gclid remover",
    "privacy",
    "LinkClean",
  ],
  authors: [{ name: "Jeffrey Hamilton" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "LinkClean — Strip tracking from URLs instantly",
    description:
      "Stop sharing tracking data when you share links. 100% client-side, no sign-up, no tracking.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LinkClean",
    description: "Strip tracking parameters from URLs instantly.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f14" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
