import type { Metadata } from "next";
import ChristmasPage from "./ChristmasContent.client";

export const metadata: Metadata = {
  title:
    "Merry Christmas 2025 from PENXCHAIN | Celebrating the Privacy Community",
  description:
    "PENXCHAIN wishes a Merry Christmas to all privacy-conscious builders and communities—Aleo, Base, zkSync, Scroll, Starknet, Verza, and more. Together we're building a private, decentralized future.",
  keywords: [
    "PENXCHAIN Christmas",
    "blockchain Christmas",
    "crypto Christmas 2025",
    "privacy blockchain community",
    "Aleo Christmas",
    "Base blockchain",
    "zkSync",
    "Starknet",
    "Scroll ZK",
    "crypto community",
    "blockchain builders",
    "privacy community",
    "happy holidays blockchain",
  ],
  openGraph: {
    title: "Merry Christmas from PENXCHAIN 🎄",
    description:
      "To all our privacy-conscious friends, families, and communities—Merry Christmas from PENXCHAIN! Celebrating the builders making privacy possible.",
    url: "https://penxchain.org/blog/merry-christmas-2025",
    siteName: "PENXCHAIN",
    images: [
      {
        url: "https://penxchain.org/blog-images/christmas-2025.jpg",
        width: 1200,
        height: 630,
        alt: "Merry Christmas 2025 from PENXCHAIN",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merry Christmas from PENXCHAIN 🎄",
    description:
      "Celebrating the privacy blockchain community this Christmas. To Aleo, Base, zkSync, Scroll, Starknet, and all builders—Happy Holidays!",
    images: ["https://penxchain.org/blog-images/christmas-2025.jpg"],
  },
  alternates: {
    canonical: "https://penxchain.org/blog/merry-christmas-2025",
  },
};

export default function Page() {
  return <ChristmasPage />;
}
