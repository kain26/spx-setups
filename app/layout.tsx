import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://myspx-playbook.ioou.chatgpt.site"),
    title: {
      default: "SPX Setups",
      template: "%s · SPX Setups",
    },
    description: "Five curated SPX 0DTE setups: read the 5-minute market case, then execute the 1-minute trigger.",
    keywords: ["SPX", "0DTE", "Options", "VWAP", "Gamma", "Options Wall", "交易框架"],
    authors: [{ name: "SPX Setups", url: "https://myspx.trade" }],
    creator: "@mm_options",
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "SPX Setups",
      title: "SPX Setups",
      description: "5 Cases · 5 Setups · 5m Context → 1m Trigger",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "SPX Setups",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "SPX Setups",
      description: "5 Cases · 5 Setups · 5m Context → 1m Trigger",
      creator: "@mm_options",
      images: ["/og.png"],
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
