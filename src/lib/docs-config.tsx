import {
  BookOpen,
  Layers,
  Cpu,
  Shield,
  FileText,
  LucideIcon,
} from "lucide-react";

export type DocItem = {
  id: string; // The slug
  title: string;
  description?: string;
};

export type DocCategory = {
  category: string;
  icon: LucideIcon;
  items: DocItem[];
};

export const DOCS_NAVIGATION: DocCategory[] = [
  {
    category: "Summary",
    icon: BookOpen,
    items: [
      {
        id: "executive-summary",
        title: "Executive Summary",
        description: "High-level overview of the PENXCHAIN ecosystem and mission.",
      },
      {
        id: "story-and-vision",
        title: "PENXCHAIN Story and Vision",
        description: "The 'Why' behind PENXCHAIN: solving privacy and commerce fragmentation.",
      },
    ],
  },
  {
    category: "Market",
    icon: Layers,
    items: [
      {
        id: "market-landscape",
        title: "Market Landscape & Opportunity",
        description: "Analysis of the current crypto-commerce landscape and gaps.",
      },
    ],
  },
  {
    category: "Ecosystem",
    icon: Cpu,
    items: [
      {
        id: "ecosystem-overview",
        title: "Ecosystem Overview",
        description: "How the Wallet, Marketplace, and PENXPAY work together.",
      },
      {
        id: "native-wallet",
        title: "Native Wallet",
        description: "Features of the non-custodial, privacy-first PENXCHAIN Wallet.",
      },
      {
        id: "marketplace",
        title: "E-Commerce Marketplace",
        description: "Private peer-to-peer commerce infrastructure.",
      },
    ],
  },
  {
    category: "Governance",
    icon: Shield,
    items: [
      {
        id: "governance",
        title: "Governance through PENXDAO",
        description: "Community ownership and decision-making structure.",
      },
    ],
  },
  {
    category: "Tokenomics",
    icon: FileText,
    items: [
      {
        id: "token-overview",
        title: "PENX Token Overview",
        description: "Supply, distribution, and core metrics.",
      },
      {
        id: "token-utility",
        title: "Token Utility",
        description: "Staking, payments, and governance utility.",
      },
      {
        id: "economic-flywheel",
        title: "Economic Flywheel and Revenue",
        description: "How value accrues to the ecosystem and token holders.",
      },
    ],
  },
  {
    category: "Technical",
    icon: Cpu,
    items: [
      {
        id: "technology-architecture",
        title: "Technology and Architecture",
        description: "Technical deep dive: Hybrid model (Base + Aleo), ZKPs, and storage.",
      },
      {
        id: "roadmap",
        title: "Roadmap",
        description: "Future development milestones and phases.",
      },
    ],
  },
];

export function getDocConfig(slug: string): DocItem | undefined {
  for (const category of DOCS_NAVIGATION) {
    const item = category.items.find((item) => item.id === slug);
    if (item) return item;
  }
  return undefined;
}

export function getNextPrevDocs(slug: string) {
  const flatDocs = DOCS_NAVIGATION.flatMap((cat) => cat.items);
  const index = flatDocs.findIndex((doc) => doc.id === slug);

  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? flatDocs[index - 1] : null,
    next: index < flatDocs.length - 1 ? flatDocs[index + 1] : null,
  };
}
