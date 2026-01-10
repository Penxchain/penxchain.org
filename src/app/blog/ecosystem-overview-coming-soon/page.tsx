import type { Metadata } from "next";
import EcosystemTeaserPage from "./EcosystemTeaserContent.client";

const baseUrl = "https://penxchain.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "PENXCHAIN Ecosystem Overview Coming Soon | Full Architecture Reveal",
  description:
    "Stay tuned for PENXCHAIN's comprehensive ecosystem overview. Discover how our hybrid Base + Aleo architecture enables what many thought impossible—privacy-powered commerce at scale.",
  keywords: [
    "PENXCHAIN ecosystem",
    "ecosystem overview",
    "PENXCHAIN roadmap",
    "Base Aleo integration",
    "PENXCHAIN announcement",
    "hybrid blockchain ecosystem",
    "$PENX token",
    "privacy commerce platform",
    "PENXCHAIN architecture",
    "blockchain ecosystem launch",
    "coming soon PENXCHAIN",
    "Base Aleo partnership",
  ],
  openGraph: {
    title: "PENXCHAIN Ecosystem Overview Coming Soon",
    description:
      "The complete blueprint for privacy-powered commerce is almost here. Stay tuned for the full PENXCHAIN ecosystem reveal.",
    url: "https://penxchain.org/blog/ecosystem-overview-coming-soon",
    siteName: "PENXCHAIN",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://penxchain.org/blog-images/ecosystem-teaser.jpg",
        width: 1200,
        height: 630,
        alt: "PENXCHAIN Ecosystem Teaser - Privacy Commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full PENXCHAIN Ecosystem Overview Coming Soon",
    description:
      "The comprehensive architecture, roadmap, and vision for privacy-powered commerce. Stay tuned.",
    images: ["https://penxchain.org/blog-images/ecosystem-teaser.jpg"],
  },
  alternates: {
    canonical: "https://penxchain.org/blog/ecosystem-overview-coming-soon",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the PENXCHAIN Ecosystem?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The PENXCHAIN Ecosystem is a comprehensive suite of financial tools built on a hybrid architecture of Base and Aleo. It includes a privacy-first wallet, a decentralized marketplace, and a merchant payment gateway.",
        },
      },
      {
        "@type": "Question",
        name: "When will the PENXCHAIN Ecosystem be revealed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The full architectural overview and ecosystem roadmap are coming soon. We are currently finalizing the documentation for our unique hybrid privacy model.",
        },
      },
      {
        "@type": "Question",
        name: "How does the PENXCHAIN Ecosystem work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The ecosystem works by combining the speed and low cost of the Base Layer 2 blockchain with the privacy-preserving capabilities of Aleo's Zero-Knowledge technology.",
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
      <EcosystemTeaserPage />
    </>
  );
}
