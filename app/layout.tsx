import { Poppins } from "next/font/google";
import { Metadata } from "next";
import "../styles/globals.css";
import "../styles/animations.css";
import "../styles/components/buttons.css";
import "../styles/components/badges.css";
import "../styles/components/cards.css";
import "../styles/sections/hero.css";
import "../styles/sections/seo.css";
import "../styles/sections/features.css";
import "../styles/sections/featured.css";
import "../styles/sections/wallet.css";
import "../styles/sections/marketplace.css";
import "../styles/sections/team.css";
import "../styles/sections/waitlist.css";
import "../styles/sections/nav.css";
import "../styles/sections/footer.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://penxchain.org"),

  title: {
    default: "PENXCHAIN — Privacy-Focused Blockchain Ecosystem",
    template: "%s | PENXCHAIN",
  },

  description:
    "PENXCHAIN is a privacy-first blockchain ecosystem offering a decentralized wallet, private payments, DeFi tools, and a global marketplace built for true financial freedom.",
  keywords: [
    "PENXCHAIN",
    "pen",
    "privacy blockchain",
    "decentralized wallet",
    "private payments",
    "blockchain marketplace",
    "DeFi tools",
    "secure finance",
    "user-first blockchain",
    "data ownership",
    "financial freedom",
    "crypto privacy",
    "blockchain ecosystem",
    "PENX",
    "private crypto",
    "blockchain security",
    "privacy technology",
    "decentralized finance",
    "private transactions",
    "blockchain innovation",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://penxchain.org",
  },

  openGraph: {
    title: "PENXCHAIN — Private Blockchain, Wallet & Marketplace",
    description:
      "Own your data. Control your assets. Experience privacy-powered blockchain technology.",
    url: "https://penxchain.org",
    siteName: "PENXCHAIN",
    images: [
      {
        url: "/img/.png",
        width: 1200,
        height: 630,
        alt: "PENXCHAIN Blockchain Ecosystem",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PENXCHAIN — Privacy Blockchain Ecosystem",
    description:
      "A privacy-first blockchain with wallet, payments, and decentralized marketplace.",
    images: ["/img/featured.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className={poppins.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
