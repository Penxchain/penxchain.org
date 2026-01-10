import type { Metadata } from "next";
import ZeroKnowledgeProofsPage from "./ZkpContent.client";

const baseUrl = "https://penxchain.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "What is ZKP? Zero-Knowledge Proofs Explained | PENXCHAIN",
  description:
    "Learn the meaning of Zero-Knowledge Proofs (ZKPs) and how they protect privacy in blockchain. A comprehensive guide to ZK-SNARKs and private commerce.",
  keywords: [
    "What is zkp",
    "Zkp in Penxchain",
    "zero-knowledge proofs",
    "ZKP meaning",
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
  ],
  openGraph: {
    title: "What is ZKP? Zero-Knowledge Proofs Explained | PENXCHAIN",
    description:
      "Discover how Zero-Knowledge Proofs protect your privacy while maintaining blockchain security. A beginner-friendly guide to ZKP technology.",
    url: "https://penxchain.org/blog/zero-knowledge-proofs",
    siteName: "PENXCHAIN",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://penxchain.org/blog-images/zkp-in-penxchain.jpg",
        width: 1200,
        height: 630,
        alt: "Zero-Knowledge Proofs Explained",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is ZKP? Zero-Knowledge Proofs Explained",
    description:
      "Learn how ZKPs enable private, secure, and verifiable digital commerce on blockchain without revealing your data.",
    images: ["https://penxchain.org/blog-images/zkp-in-penxchain.jpg"],
  },
  alternates: {
    canonical: "https://penxchain.org/blog/zero-knowledge-proofs",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the meaning of ZKP (Zero-Knowledge Proof)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Zero-Knowledge Proof (ZKP) is a cryptographic method that allows one party to prove to another that a statement is true without revealing any specific information about the statement itself. It ensures privacy while verifying validity.",
        },
      },
      {
        "@type": "Question",
        name: "How do Zero-Knowledge Proofs work in Blockchain?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In blockchain, ZKPs allow transactions to be verified as valid without revealing the sender, receiver, or transaction amount publicly. This enables confidential commerce and greater user privacy.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between ZK-SNARKs and ZK-STARKs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ZK-SNARKs and ZK-STARKs are types of zero-knowledge proofs. ZK-SNARKs rely on a trusted setup and have smaller proof sizes, while ZK-STARKs do not require a trusted setup and offer transparency but with larger proof sizes.",
        },
      },
    ],
  };

  return (
    <>
      {/* Inject Schema for Google Search Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ZeroKnowledgeProofsPage />
    </>
  );
}
