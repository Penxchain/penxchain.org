import type { Metadata } from "next";
import ZeroKnowledgeProofsPage from "./ZkpContent.client";

export const metadata: Metadata = {
  title:
    "Zero-Knowledge Proofs Explained | Privacy Technology in Blockchain | PENXCHAIN",
  description:
    "Learn how Zero-Knowledge Proofs (ZKPs) work and why they're essential for privacy-powered commerce. A comprehensive guide to understanding ZKP technology in PENXCHAIN's blockchain ecosystem.",
  keywords: [
    "zero-knowledge proofs",
    "ZKP",
    "ZK-SNARKs",
    "ZK-STARKs",
    "blockchain privacy",
    "cryptography",
    "PENXCHAIN ZKP",
    "private transactions",
    "confidential commerce",
    "privacy technology",
    "zero knowledge blockchain",
    "ZKP explained",
    "how zero-knowledge proofs work",
    "privacy-powered commerce",
  ],
  openGraph: {
    title: "Zero-Knowledge Proofs Explained | PENXCHAIN",
    description:
      "Discover how Zero-Knowledge Proofs protect your privacy while maintaining blockchain security. A beginner-friendly guide to ZKP technology.",
    url: "https://penxchain.org/blog/zero-knowledge-proofs",
    siteName: "PENXCHAIN",
    images: [
      {
        url: "https://penxchain.org/blog-images/zkp-explained.jpg",
        width: 1200,
        height: 630,
        alt: "Zero-Knowledge Proofs in blockchain - privacy technology",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zero-Knowledge Proofs Explained | PENXCHAIN",
    description:
      "Learn how ZKPs enable private, secure, and verifiable digital commerce on blockchain.",
    images: ["https://penxchain.org/blog-images/zkp-explained.jpg"],
  },
  alternates: {
    canonical: "https://penxchain.org/blog/zero-knowledge-proofs",
  },
};

export default function Page() {
  return <ZeroKnowledgeProofsPage />;
}
