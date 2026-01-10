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
    // I matched this image to the OG image for consistency
    images: ["https://penxchain.org/blog-images/penxchain-wallet-overview.jpg"],
    creator: "@penxchain",
    site: "@penxchain",
  },
  alternates: {
    // Fixed: Canonical should match the page URL to avoid SEO penalties
    canonical: "https://penxchain.org/blog/penxchain-wallet-overview",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the PENXCHAIN Wallet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The PENXCHAIN Wallet is a privacy-first, self-custodial cryptocurrency wallet. It allows users to store, swap, and transact digital assets using Zero-Knowledge Proofs to keep financial data private.",
        },
      },
      {
        "@type": "Question",
        name: "Is the PENXCHAIN Wallet self-custodial?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, PENXCHAIN is fully self-custodial. This means you hold your own private keys and have full control over your funds; the platform cannot access or freeze your assets.",
        },
      },
      {
        "@type": "Question",
        name: "How does the PENXCHAIN Wallet ensure privacy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The wallet uses Zero-Knowledge Proof (ZKP) technology to verify transactions without revealing the sender, receiver, or amount on the public ledger, ensuring your financial activity remains confidential.",
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
      <WalletContent />
    </>
  );
}
