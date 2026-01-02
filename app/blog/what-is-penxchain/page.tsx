import { Metadata } from "next";
import WhatIsContent from "./WhatIsContent.client";

const baseUrl = "https://penxchain.org";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "What is PENXCHAIN — Private Blockchain & Wallet",
  description:
    "Learn what PENXCHAIN is: a privacy-first blockchain ecosystem with a decentralized wallet, private payments, and a marketplace built for secure, user-first finance.",
  keywords: [
    "What is PENXCHAIN",
    "Is PENXCHAIN private",
    "PENXCHAIN privacy",
    "Is PENXCHAIN secure",
    "Is PENXCHAIN decentralized",
    "Is Penxchain safe",
    "Is PENXCHAIN legit",
    "PENXCHAIN blockchain",
    "PENXCHAIN wallet",
    "privacy blockchain",
    "decentralized wallet",
    "private payments",
    "secure blockchain",
    "user-first finance",
    "PENXCHAIN ecosystem",
    "blockchain privacy",
  ],
  openGraph: {
    title: "What is PENXCHAIN — Private Blockchain & Wallet",
    description:
      "Learn what PENXCHAIN is: a privacy-first blockchain ecosystem with a decentralized wallet, private payments, and a marketplace built for secure, user-first finance.",
    url: "https://penxchain.org/what-is-penxchain",
    siteName: "PENXCHAIN",
    locale: "en_US",
    type: "website",

    images: [
      {
        url: "https://penxchain.org/blog-images/what-is-penxchain.jpg",
        width: 1200,
        height: 630,
        alt: "What is PENXCHAIN Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "What is PENXCHAIN — Private Blockchain & Wallet",
    description:
      "Learn what PENXCHAIN is: a privacy-first blockchain ecosystem with a decentralized wallet...",
    images: ["https://penxchain.org/blog-images/what-is-penxchain.jpg"], 
  },
  siteName: "PENXCHAIN",
    images: [
      {
        url: "https://penxchain.org/blog-images/what-is-penxchain.jpg",
        width: 1200,
        height: 630,
        alt: "What is PENXCHAIN?",
      },
    ],
    locale: "en_US",
    type: "article",
};

export default function WhatIsPenxchain() {
  return <WhatIsContent />;
}
