import { Metadata } from "next";
import WalletContent from "./WalletOverviewContent";

const baseUrl = "https://penxchain.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "PENXCHAIN Wallet Overview — Privacy-First Self-Custodial Wallet",
  description:
    "Discover the PENXCHAIN Wallet: a privacy-first, self-custodial wallet using Zero-Knowledge Proofs for secure everyday payments. Transact, swap, and trade without exposing your balance or activity.",
  keywords: [
    "PENXCHAIN Wallet",
    "wallet overview",
    "privacy wallet",
    "self-custodial wallet",
    "zero-knowledge proofs",
    "ZK wallet",
    "private crypto wallet",
    "secure wallet",
    "PENXCHAIN crypto wallet",
    "decentralized wallet",
    "private payments",
    "anonymous crypto wallet",
    "crypto privacy",
    "blockchain wallet",
    "self-custody crypto",
    "private crypto transactions",
    "secure crypto payments",
  ],
  openGraph: {
    title: "PENXCHAIN Wallet Overview — Privacy-First Self-Custodial Wallet",
    description:
      "Discover the PENXCHAIN Wallet: a privacy-first, self-custodial wallet using Zero-Knowledge Proofs for secure everyday payments. Transact, swap, and trade without exposing your balance or activity.",
    url: "https://penxchain.org/blog/penxchain-wallet-overview",
    locale: "en_US",
    type: "article",
    publishedTime: "2025-01-05T00:00:00.000Z",
    authors: ["PENXCHAIN Team"],
    images: [
      {
        url: "https://penxchain.org/blog-images/penxchain-wallet-overview.jpg",
        width: 1200,
        height: 630,
        alt: "PENXCHAIN Wallet Overview - Privacy-First Self-Custodial Wallet",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PENXCHAIN Wallet — Privacy-First Self-Custodial Wallet",
    description:
      "Discover the PENXCHAIN Wallet: a privacy-first, self-custodial wallet using Zero-Knowledge Proofs for secure everyday payments.",
    images: ["https://penxchain.org/blog-images/penxchain-wallet.jpg"],
    creator: "@penxchain",
    site: "@penxchain",
  },

  alternates: {
    canonical: "https://penxchain.org/blog/penxchain-wallet",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function PenxchainWallet() {
  return <WalletContent />;
}
