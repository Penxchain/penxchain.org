import { Metadata } from "next";
import PenxTokenUtilityContent from "./PenxTokenUtilityContent.client";

const baseUrl = "https://penxchain.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "$PENX Token Utility: The Economic Backbone of PENXCHAIN",
  description:
    "Explore how $PENX powers the PENXCHAIN ecosystem through staking rewards, governance, payment utility, liquidity incentives, and merchant benefits.",
  keywords: [
    "$PENX token",
    "PENX utility",
    "PENXCHAIN token",
    "crypto staking",
    "governance token",
    "privacy coin",
    "liquidity incentives",
    "crypto rewards",
    "blockchain payments",
    "merchant crypto",
    "PENX tokenomics",
    "staking rewards",
  ],
  openGraph: {
    title: "$PENX Token Utility: The Economic Backbone of PENXCHAIN",
    description:
      "From staking to governance and merchant perks, discover how $PENX drives privacy-first commerce and community participation.",
    url: "https://penxchain.org/blog/penx-token-utility",
    siteName: "PENXCHAIN",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: "https://penxchain.org/blog-images/penx-token-utility.jpg",
        width: 1200,
        height: 630,
        alt: "$PENX Token Utility and Economics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "$PENX Token Utility | Governance & Staking",
    description:
      "Discover the power of $PENX: Staking, Governance, and Privacy-First Payments driving the PENXCHAIN ecosystem.",
    images: ["https://penxchain.org/blog-images/penx-token-utility.jpg"],
  },
  alternates: {
    canonical: "https://penxchain.org/blog/penx-token-utility",
  },
};

export default function PenxTokenUtilityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the utility of the $PENX token?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "$PENX is the native utility token of PENXCHAIN. It is used for paying transaction fees, staking for rewards, voting on governance proposals, and incentivizing liquidity in the ecosystem.",
        },
      },
      {
        "@type": "Question",
        name: "Can I stake $PENX tokens?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, $PENX holders can stake their tokens to secure the network and earn staking rewards. This incentivizes long-term participation and network stability.",
        },
      },
      {
        "@type": "Question",
        name: "Does holding $PENX give me voting rights?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, $PENX serves as a governance token. Holders can vote on key protocol upgrades, changes to the ecosystem, and community proposals, giving them a voice in the platform's future.",
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
      <PenxTokenUtilityContent />
    </>
  );
}
