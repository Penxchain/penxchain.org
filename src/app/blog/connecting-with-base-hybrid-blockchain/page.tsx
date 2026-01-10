import { Metadata } from "next";
import BaseHybridContent from "./BaseHybridContent.client";

const baseUrl = "https://penxchain.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Connecting with Base: PENXCHAIN's Hybrid Architecture",
  description:
    "Discover how PENXCHAIN leverages both Aleo's zero-knowledge technology and Base's liquidity infrastructure to create a privacy-first blockchain with real-world adoption.",
  keywords: [
    "PENXCHAIN hybrid architecture",
    "Base blockchain integration",
    "Aleo zero knowledge",
    "privacy blockchain",
    "layer 2 scaling",
    "crypto liquidity",
    "hybrid blockchain",
    "PENXCHAIN Base",
    "Aleo privacy technology",
    "cross-chain bridge",
    "blockchain interoperability",
    "EVM compatibility",
  ],
  openGraph: {
    title: "Connecting with Base: PENXCHAIN's Hybrid Architecture",
    description:
      "How PENXCHAIN combines private execution on Aleo with liquidity on Base to scale privacy without sacrificing adoption.",
    url: "https://penxchain.org/blog/connecting-with-base-hybrid-blockchain",
    siteName: "PENXCHAIN",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://penxchain.org/blog-images/base-hybrid.jpg",
        width: 1200,
        height: 630,
        alt: "PENXCHAIN Hybrid Architecture - Base and Aleo Integration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Connecting with Base | PENXCHAIN Hybrid Model",
    description:
      "Privacy meets Liquidity. See how PENXCHAIN combines Aleo's ZK tech with Base's massive ecosystem.",
    images: [
      "https://penxchain.org/blog-images/base-hybrid.jpg",
    ],
  },
  alternates: {
    canonical:
      "https://penxchain.org/blog/connecting-with-base-hybrid-blockchain",
  },
};

export default function BaseHybridPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is PENXCHAIN's Hybrid Architecture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PENXCHAIN uses a hybrid model that combines Aleo's Zero-Knowledge technology for private execution with the Base blockchain for deep liquidity and widespread adoption.",
        },
      },
      {
        "@type": "Question",
        name: "Why does PENXCHAIN integrate with Base?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Integrating with Base allows PENXCHAIN to tap into Coinbase's massive ecosystem, ensuring fast, low-cost transactions and access to deep liquidity pools while maintaining user privacy.",
        },
      },
      {
        "@type": "Question",
        name: "How does Aleo technology fit into PENXCHAIN?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PENXCHAIN leverages Aleo's ZK-SNARKs technology to handle the computation and verification of private transactions off-chain, ensuring that sensitive data is never exposed on the public ledger.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BaseHybridContent />
    </>
  );
}
