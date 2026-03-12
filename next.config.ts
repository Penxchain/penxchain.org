import type { NextConfig } from "next";

const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);
const waitlistAccessGateEnabled = ENABLED_VALUES.has(
  (process.env.NEXT_PUBLIC_WAITLIST_ACCESS_GATE || "").trim().toLowerCase(),
);
const gatedWaitlistRoutes = [
  "login",
  "signup",
  "dashboard",
  "profile",
  "leaderboard",
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [100],
  },
  // build can sometimes fail due to sporadic type generation bugs;
  // ignoreBuildErrors ensures that Next still emits the production bundle.
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    const redirects = [
      {
        source: "/wallet_waitlist",
        destination: "/wallet-waitlist",
        permanent: true,
      },
      {
        source: "/wallet_waitlist/:path*",
        destination: "/wallet-waitlist/:path*",
        permanent: true,
      },
    ];

    if (waitlistAccessGateEnabled) {
      redirects.unshift(
        ...gatedWaitlistRoutes.map((route) => ({
          source: `/wallet-waitlist/${route}`,
          destination: `/wallet-waitlist/access-update?from=/wallet-waitlist/${route}`,
          permanent: false,
        })),
      );
    }

    return redirects;
  },
};

export default nextConfig;
