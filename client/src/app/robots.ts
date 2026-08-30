import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/product";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Order-scoped and provider-callback routes carry personal data and
        // must never be indexed.
        disallow: ["/api/", "/payment/", "/delivery/", "/success", "/failure"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
