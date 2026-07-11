import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://agentipedia.example"),
  title: {
    default: "Agentipedia by HUB Institute — the library of AI agents at work",
    template: "%s — Agentipedia by HUB Institute",
  },
  description:
    "A self-updating catalog of real, verified AI agent deployments inside named companies, worldwide. Every entry names the company and the exact solution, with sources.",
  openGraph: {
    title: "Agentipedia by HUB Institute",
    description: "From AI promise to business proof: real companies, named AI agents, verified sources — worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
