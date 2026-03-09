import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import React, { Suspense } from "react";
import { Analytics } from "@/components/Analytics";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PaymentRedirectHandler } from "@/components/PaymentRedirectHandler";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://seoprompt.ai";
const SITE_NAME = "SEO Prompt Generator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Generate Complete SEO Strategies`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Describe your project and get a complete SEO plan including keywords, content structure, metadata, and optimization instructions — in one prompt.",
  applicationName: SITE_NAME,
  authors: [{ name: "Suhail Roushan", url: "https://suhailroushan.com" }],
  creator: "Suhail Roushan",
  publisher: SITE_NAME,
  keywords: [
    "SEO prompt generator",
    "SEO strategy",
    "keyword research",
    "content structure",
    "meta tags generator",
    "SEO plan",
    "AI SEO tool",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Generate Complete SEO Strategies`,
    description:
      "Describe your project and get a complete SEO plan including keywords, content structure, metadata, and optimization instructions.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — One prompt, full SEO plan`,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Generate Complete SEO Strategies`,
    description:
      "Generate complete SEO strategies in one prompt. Keywords, content structure, metadata, and optimization.",
    images: ["/og-image.png"],
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
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;var k=localStorage.getItem('theme');if(k==='dark'||(!k&&window.matchMedia('(prefers-color-scheme: dark)').matches))d.classList.add('dark');else d.classList.remove('dark');})();`,
          }}
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Suspense fallback={null}>
          <PaymentRedirectHandler />
        </Suspense>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <Script
          src="https://cdn.databuddy.cc/databuddy.js"
          data-client-id="8853c966-1b40-4916-b610-e2bd1fd802e3"
          data-track-hash-changes="true"
          data-track-attributes="true"
          data-track-outgoing-links="true"
          data-track-interactions="true"
          data-track-scroll-depth="true"
          data-track-web-vitals="true"
          data-track-errors="true"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
