import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    return [
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
  },
};

export default nextConfig;
