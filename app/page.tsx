import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FeaturedProducts from "@/components/FeaturedProducts";
import WalletOverview from "@/components/WalletOverview";
import MarketplaceOverview from "@/components/MarketplaceOverview";
import Team from "@/components/Team";
import Waitlist from "@/components/Waitlist";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <FeaturedProducts />
      <WalletOverview />
      <MarketplaceOverview />
      <Team />
      <Waitlist />
    </main>
  );
}
