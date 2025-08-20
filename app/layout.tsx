// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Import the new provider
import "react-syntax-highlighter/dist/esm/styles/prism/one-dark";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Tailwind CSS Refactor Copilot | Convert CSS to Tailwind",
  description: "A free, AI-powered tool to instantly refactor messy CSS, inline styles, or HTML into clean, best-practice Tailwind CSS. No sign-up required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* Wrap children with Providers */}
      </body>
    </html>
  );
}