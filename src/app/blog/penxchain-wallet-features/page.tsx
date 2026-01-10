import type { Metadata } from "next";
import WalletFeaturesPage from "./WalletFeaturesContent.client";

const baseUrl = "https://penxchain.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title:
    "PENXCHAIN Wallet Features: Privacy-First Financial Tool | Staking, Swaps & More",
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
    "private crypto wallet",
  ],
  openGraph: {
    title: "PENXCHAIN Wallet Features: Privacy-First Financial Tool",
    description:
      "Staking, swaps, private transactions, and balance obfuscation—all in one wallet. Built for people who want privacy.",
    url: "https://penxchain.org/blog/penxchain-wallet-features",
    siteName: "PENXCHAIN",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://penxchain.org/blog-images/penxchain-wallet-features.jpg",
        width: 1200,
        height: 630,
        alt: "PENXCHAIN Wallet Features - Privacy-first financial tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PENXCHAIN Wallet Features | Privacy-First Crypto Wallet",
    description:
      "Stake, swap, and transact privately. The PENXCHAIN Wallet is more than storage—it's a complete financial tool.",
    images: ["https://penxchain.org/blog-images/penxchain-wallet-features.jpg"],
  },
  alternates: {
    canonical: "https://penxchain.org/blog/penxchain-wallet-features",
  },
};

export default function Page() {
  // FAQ Schema for Wallet Features
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What features does the PENXCHAIN Wallet have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The PENXCHAIN Wallet features built-in staking for rewards, instant token swaps, private transaction history, and balance obfuscation to protect your financial data.",
        },
      },
      {
        "@type": "Question",
        name: "Can I stake and swap tokens in the PENXCHAIN Wallet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the wallet supports native staking to earn passive rewards and includes a built-in swap feature to exchange tokens instantly without leaving the app.",
        },
      },
      {
        "@type": "Question",
        name: "How does the PENXCHAIN Wallet protect my privacy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unlike standard crypto wallets that show everything publicly, PENXCHAIN uses balance obfuscation and private transaction logs, ensuring only you can see your full financial activity.",
        },
      },
    ],
  };

  return (
    <>
      {/* Inject Schema for Search Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WalletFeaturesPage />
    </>
  );
}
