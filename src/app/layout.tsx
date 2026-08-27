import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToTop from "@/components/ToTop";
import ChromeGate from "@/components/AppChrome";
import Motion from "@/components/Motion";
import { LANG_BOOT_SCRIPT } from "@/lib/lang-boot";
import { SITE_URL } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Agentipedia by HUB Institute: the Index Live of AI agents at work",
    template: "%s · Agentipedia by HUB Institute",
  },
  description:
    "A self-updating catalog of real, verified AI agent deployments inside named companies, worldwide. Every entry names the company and the exact solution, with sources.",
  openGraph: {
    title: "Agentipedia by HUB Institute",
    description: "From AI promise to business proof: real companies, named AI agents, verified sources, worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <ChromeGate><Header /></ChromeGate>
        {children}
        <ChromeGate><Footer /></ChromeGate>
        <Motion />
        <ChromeGate><ToTop /></ChromeGate>
      </body>
    </html>
  );
}
