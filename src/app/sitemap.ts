import { MetadataRoute } from "next";
import { DOCS_NAVIGATION } from "@/lib/docs-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://penxchain.org";

  // Static pages
  const routes = ["", "/blog", "/wallet-waitlist"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Docs pages
  const docRoutes = DOCS_NAVIGATION.flatMap((category) =>
    category.items.map((item) => ({
      url: `${baseUrl}/docs/${item.id}`,
      lastModified: new Date().toISOString(),
    }))
  );

  return [...routes, ...docRoutes];
}
