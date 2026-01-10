import { Metadata } from "next";
import WhyPenxchainContent from "./WhyPenxchainContent.client";

const baseUrl = "https://penxchain.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
  description:
    "Blockchain promised freedom but delivered fragmentation, exposure, and complexity. Discover why PENXCHAIN was built to solve these fundamental problems with privacy-first infrastructure.",
  keywords: [
    "Why PENXCHAIN exists",
    "Why is PENXCHAIN needed",
    "why penxchain",
    "blockchain problems",
    "Is blockchain secure",
    "PENXCHAIN problems",
    "blockchain issues",
    "blockchain fragmentation",
    "blockchain privacy",
    "private blockchain",
    "decentralized finance",
    "blockchain complexity",
    "PENXCHAIN solution",
    "privacy-first blockchain",
    "blockchain adoption",
    "secure blockchain",
    "user-first finance",
    "emerging markets blockchain",
    "PENXCHAIN vision",
  ],
  openGraph: {
    title: "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
    description:
      "The real problems blocking blockchain adoption and how PENXCHAIN fixes them with privacy, simplicity, and focus on emerging markets.",
    url: "https://penxchain.org/blog/why-penxchain-exists",
    siteName: "PENXCHAIN",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://penxchain.org/blog-images/why-penxchain-exists.jpg", // Ensure this image exists!
        width: 1200,
        height: 630,
        alt: "Why PENXCHAIN Exists - Visual Explainer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why PENXCHAIN Exists: Fixing What's Broken in Blockchain",
    description:
      "Blockchain promised freedom but delivered complexity. See how PENXCHAIN fixes this.",
    images: ["https://penxchain.org/blog-images/why-penxchain-exists.jpg"],
  },
  alternates: {
    canonical: "https://penxchain.org/blog/why-penxchain-exists",
  },
};

export default function WhyPenxchainPage() {
  // FAQ Schema: Targeting "Why" and "Problem/Solution" queries
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why does PENXCHAIN exist?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PENXCHAIN exists to solve the three biggest problems in current blockchains: fragmentation of liquidity, lack of user privacy in transactions, and extreme technical complexity that prevents mass adoption.",
        },
      },
      {
        "@type": "Question",
        name: "What problems does PENXCHAIN solve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PENXCHAIN solves the issue of public wallet exposure by using privacy-first infrastructure. It also addresses the high barrier to entry in crypto by offering a simplified, user-first financial ecosystem suitable for emerging markets.",
        },
      },
      {
        "@type": "Question",
        name: "How is PENXCHAIN different from other blockchains?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unlike public chains that expose all transaction data, PENXCHAIN prioritizes confidential commerce. It combines the security of blockchain with the privacy required for real-world business and personal finance.",
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
      <WhyPenxchainContent />
    </>
  );
}
