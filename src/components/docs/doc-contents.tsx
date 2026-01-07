export const ExecutiveSummary = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
      <p>
        PENXCHAIN is building a private digital economy designed for modern
        commerce. The ecosystem combines three main products: a secure
        multichain native wallet, a fully private e-commerce marketplace
        infrastructure, and a merchant focused payment layer called PENXPAY. All
        products operate together under a privacy first philosophy powered by
        zero knowledge programmable smart contracts.
      </p>
      <p>
        The PENX token anchors the ecosystem. Liquidity and trading occur on
        Base for stability and market depth. A wrapped private version of PENX
        exists on Aleo, enabling confidential marketplace interactions without
        sacrificing liquidity. This hybrid structure gives users both privacy
        and smooth economic activity.
      </p>
    </div>
  </div>
);

export const StoryAndVision = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300 leading-relaxed text-lg">
    <p>
      Every era of the internet has been shaped by a single question: who
      controls value and information? For decades, the answer has been
      centralized platforms. These platforms owned user data, controlled
      relationships, and extracted value from every transaction. Merchants paid
      for visibility, users exchanged privacy for convenience, and property
      owners relied on intermediaries because there were no viable alternatives.
    </p>

    <div>
      <h3 className="text-2xl font-bold text-white mb-4 font-space">
        The Problem
      </h3>
      <p className="mb-4">
        Modern commerce systems were not designed with user sovereignty in mind.
        Instead:
      </p>
      <ul className="list-disc pl-6 space-y-2 marker:text-blue-500 mb-6">
        <li>Users are profiled, tracked, and monetized.</li>
        <li>Merchants lose margin to high fees and algorithmic gatekeeping.</li>
        <li>
          Property owners depend on agents and intermediaries that reduce
          transparency and trust.
        </li>
        <li>Communities generate value, but platforms extract it.</li>
      </ul>
      <p>
        At the same time, privacy-focused blockchain solutions often fail to
        achieve real-world adoption due to limited liquidity, poor user
        experience, or insufficient infrastructure.
      </p>
    </div>

    <p>
      The project began with a simple observation. Digital commerce still
      exposes far too much user information, while blockchain projects that
      offer privacy often lack the liquidity and infrastructure needed for real
      world adoption.
    </p>

    <p>
      PENXCHAIN aims to fuse both worlds. The vision is a fully private economic
      environment that supports secure transactions, merchant growth, digital
      trade, and community governance, while remaining accessible to mainstream
      users who expect reliable liquidity and intuitive experiences.
    </p>

    <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
      <p className="text-blue-200">
        PENXCHAIN sees privacy as a right, not a premium feature. The ecosystem
        is designed to give individuals control over their financial and
        commercial data while supporting merchants with a new class of private
        yet programmable tools.
      </p>
    </div>
  </div>
);

export const PlaceholderContent = ({ title }: { title: string }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <p>
      Content for <strong>{title}</strong> is currently being authored by the
      team.
    </p>
    <p>Check back soon for detailed technical specifications.</p>
  </div>
);
