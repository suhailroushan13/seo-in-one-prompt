import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import { Analytics } from "@/components/Analytics";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PaymentRedirectHandler } from "@/components/PaymentRedirectHandler";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SEO Prompt Generator — Generate Complete SEO Strategies",
  description:
    "Describe your project and get a complete SEO plan including keywords, content structure, metadata, and optimization instructions.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://seoprompt.ai"
  ),
  openGraph: {
    title: "SEO Prompt Generator — Generate Complete SEO Strategies",
    description:
      "Describe your project and get a complete SEO plan including keywords, content structure, metadata, and optimization instructions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Prompt Generator",
    description:
      "Generate complete SEO strategies in one prompt. Keywords, content structure, metadata, and optimization.",
  },
  robots: {
    index: true,
    follow: true,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;var k=localStorage.getItem('theme');if(k==='dark'||(!k&&window.matchMedia('(prefers-color-scheme: dark)').matches))d.classList.add('dark');else d.classList.remove('dark');})();`,
          }}
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
      </body>
    </html>
  );
}
