
import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Ecosystem from "@/components/ecosystem";
import Tokenomics from "@/components/tokenomics"; // New Import
import Roadmap from "@/components/roadmap";
import Team from "@/components/team";
import Waitlist from "@/components/waitlist";

export default function Home() {
  return (
    <main className="min-h-screen bg-penx-bg">
      <Hero />
      <Features />
      <HowItWorks />
      <Ecosystem />
      <Roadmap />
      <Team />
      <Tokenomics />
      <Waitlist />
    </main>
  );
}
