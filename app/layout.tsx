import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://spx-setups.mmoptions.workers.dev";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
      default: "SPX Setups",
      template: "%s · SPX Setups",
    },
    description: "Six experimental SPX 0DTE setups for observation and study. No setup has validated historical results.",
    keywords: ["SPX", "0DTE", "Options", "VWAP", "Gamma", "Options Wall", "交易框架"],
    authors: [{ name: "SPX Setups", url: "https://myspx.trade" }],
    creator: "@mm_options",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: "SPX Setups",
      title: "SPX Setups",
      description: "6 Experimental Setups · Observation → Confirmation → Risk",
      images: [
        {
          url: "/og.png?v=20260918",
          width: 1200,
          height: 630,
          alt: "SPX Setups — Read 5m. Execute 1m.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "SPX Setups",
      description: "6 Experimental Setups · Observation → Confirmation → Risk",
      creator: "@mm_options",
      images: ["/og.png?v=20260918"],
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
};

export const viewport: Viewport = {
  themeColor: "#09090a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
