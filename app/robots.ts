import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/links", "/cv"],
        disallow: ["/admin", "/api/admin"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
