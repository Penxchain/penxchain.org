import type { Metadata } from "next";
import EcosystemTeaserPage from "./EcosystemTeaserContent.client";

export const metadata: Metadata = {
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
    images: [
      {
        url: "https://penxchain.org/blog-images/ecosystem-teaser.jpg",
        width: 1200,
        height: 630,
        alt: "PENXCHAIN ecosystem overview coming soon",
      },
    ],
    locale: "en_US",
    type: "article",
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
  return <EcosystemTeaserPage />;
}
