import type { Metadata } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RevealObserver } from "@/components/reveal";
import { site } from "@/data/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-editorial", display: "swap" });
export const metadata: Metadata = {
  title: { default: site.title, template: "%s - Atelier Arvena" },
  description: site.description,
  openGraph: { title: site.title, description: site.description, siteName: site.name, type: "website", locale: "en_US", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/opengraph-image"] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${manrope.variable} ${instrument.variable}`}><body id="top"><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{children}</main><Footer /><RevealObserver /></body></html>;
}
