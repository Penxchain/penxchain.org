import {
  ExecutiveSummary,
  StoryAndVision,
} from "@/components/docs/content/summary";

import { MarketLandscape } from "@/components/docs/content/market";

import {
  EcosystemOverview,
  NativeWallet,
  Marketplace,
} from "@/components/docs/content/ecosystem";

import { Governance } from "@/components/docs/content/governance";

import {
  TokenOverview,
  TokenUtility,
  EconomicFlywheel,
} from "@/components/docs/content/tokenomics";

import {
  TechnologyArchitecture,
  Roadmap,
} from "@/components/docs/content/technical";

import { PlaceholderContent } from "@/components/docs/doc-contents";

// This registry maps slugs to their respective React components.
// We use a function to return the component to allow for potential lazy loading or props injection in the future.

type DocComponent = React.ComponentType<any>;

export const DOCS_REGISTRY: Record<string, DocComponent> = {
  "executive-summary": ExecutiveSummary,
  "story-and-vision": StoryAndVision,
  "market-landscape": MarketLandscape,
  "ecosystem-overview": EcosystemOverview,
  "native-wallet": NativeWallet,
  "marketplace": Marketplace,
  "governance": Governance,
  "token-overview": TokenOverview,
  "token-utility": TokenUtility,
  "economic-flywheel": EconomicFlywheel,
  "technology-architecture": TechnologyArchitecture,
  "roadmap": Roadmap,
};

export function getDocComponent(slug: string): DocComponent | null {
  return DOCS_REGISTRY[slug] || null;
}
