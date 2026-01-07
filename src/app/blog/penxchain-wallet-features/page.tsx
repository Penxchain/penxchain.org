import type { Metadata } from "next";
import WalletFeaturesPage from "./WalletFeaturesContent.client";

export const metadata: Metadata = {
  title: "PENXCHAIN Wallet Features: Privacy-First Financial Tool | Staking, Swaps & More",
  description:
    "Discover PENXCHAIN Wallet features: staking rewards, built-in swaps, private transaction history, and balance obfuscation. Simple on the surface. Powerful underneath.",
  keywords: [
    "PENXCHAIN wallet",
    "crypto wallet features",
    "privacy wallet",
    "crypto staking",
    "wallet swaps",
    "private transactions",
    "balance obfuscation",
    "zero-knowledge wallet",
    "privacy-first wallet",
    "crypto wallet",
    "PENXCHAIN features",
    "private crypto wallet"
  ],
  openGraph: {
    title: "PENXCHAIN Wallet Features: Privacy-First Financial Tool",
    description:
      "Staking, swaps, private transactions, and balance obfuscation—all in one wallet. Built for people who want privacy.",
    url: "https://penxchain.org/blog/penxchain-wallet-features",
    siteName: "PENXCHAIN",
    images: [
      {
        url: "https://penxchain.org/blog-images/wallet-features.jpg",
        width: 1200,
        height: 630,
        alt: "PENXCHAIN Wallet Features - Privacy-first financial tool",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "PENXCHAIN Wallet Features | Privacy-First Crypto Wallet",
    description:
      "Stake, swap, and transact privately. The PENXCHAIN Wallet is more than storage—it's a complete financial tool.",
    images: ["https://penxchain.org/blog-images/wallet-features.jpg"],
  },
  alternates: {
    canonical: "https://penxchain.org/blog/penxchain-wallet-features",
  },
};

export default function Page() {
  return <WalletFeaturesPage />;
}