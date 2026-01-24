import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/smooth-scroll";
import LayoutWrapper from "@/components/layout-wrapper"; // Import the Controller

export const metadata: Metadata = {
  metadataBase: new URL("https://penxchain.org"),

  title: {
    default: "PENXCHAIN — Privacy-Focused Blockchain Ecosystem",
    template: "%s | PENXCHAIN",
  },

  description:
    "PENXCHAIN is a privacy-first blockchain ecosystem offering a decentralized wallet, private payments, DeFi tools, and a global marketplace built for true financial freedom.",
  keywords: [
    "PENXCHAIN",
    "pen",
    "privacy blockchain",
    "decentralized wallet",
    "private payments",
    "blockchain marketplace",
    "DeFi tools",
    "secure finance",
    "user-first blockchain",
    "data ownership",
    "financial freedom",
    "crypto privacy",
    "blockchain ecosystem",
    "PENX",
    "private crypto",
    "blockchain security",
    "privacy technology",
    "decentralized finance",
    "private transactions",
    "blockchain innovation",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://penxchain.org",
  },

  openGraph: {
    title: "PENXCHAIN — Private Blockchain, Wallet & Marketplace",
    description:
      "Own your data. Control your assets. Experience privacy-powered blockchain technology.",
    url: "https://penxchain.org",
    siteName: "PENXCHAIN",
    images: [
      {
        url: "/penxchain-og.jpeg",
        width: 1200,
        height: 630,
        alt: "PENXCHAIN Blockchain Ecosystem",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PENXCHAIN — Privacy Blockchain Ecosystem",
    description:
      "A privacy-first blockchain with wallet, payments, and decentralized marketplace.",
    images: ["/penxchain-og.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-penx-bg text-white antialiased font-sans"
        )}
      >
        <SmoothScroll>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}
