import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import React, { Suspense } from "react";
import { Analytics } from "@/components/Analytics";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PaymentRedirectHandler } from "@/components/PaymentRedirectHandler";
import { SITE_NAME, SITE_URL } from "@/lib/product";

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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f0d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — A Complete SEO Plan in One Prompt`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Describe your page and get a complete SEO implementation prompt — keyword strategy, metadata, JSON-LD schema, technical SEO, and Core Web Vitals targets. One payment, no account.",
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
    title: `${SITE_NAME} — A Complete SEO Plan in One Prompt`,
    description:
      "Describe your page and get a complete SEO implementation prompt: keywords, metadata, schema, technical SEO, and Core Web Vitals targets.",
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
    title: `${SITE_NAME} — A Complete SEO Plan in One Prompt`,
    description:
      "Describe your page and get a complete SEO implementation prompt: keywords, metadata, schema, technical SEO, and Core Web Vitals targets.",
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/favicon-16x16.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/favicon-96x96.png?v=3", sizes: "96x96", type: "image/png" },
      { url: "/android-chrome-192x192.png?v=3", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SEO Prompt",
  },
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
        <meta name="apple-mobile-web-app-title" content="SEO Prompt" />
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
      <body className="flex min-h-screen flex-col font-sans antialiased">
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
