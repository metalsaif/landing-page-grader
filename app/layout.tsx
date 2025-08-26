// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Import the new provider


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Landing Page Grader | Instantly Audit Your Website",
  description: "A free, AI-powered tool to instantly audit your landing page for critical technical, performance, copywriting, and security best practices.",
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI Landing Page Grader",
  "description": "A free, AI-powered tool to instantly audit your landing page for critical technical, performance, copywriting, and security best practices.",
  "url": "https://landing-page-grader-ashy.vercel.app/", // IMPORTANT: Replace with your final Vercel URL
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 2. ADD THE SCRIPT TAG HERE */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* Wrap children with Providers */}
      </body>
    </html>
  );
}