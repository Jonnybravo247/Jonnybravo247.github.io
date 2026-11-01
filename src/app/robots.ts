import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Open to search engines and AI answer engines alike: being quoted is the point.
export default function robots(): MetadataRoute.Robots {
  // The client review copy must stay out of search results.
  if (process.env.NEXT_PUBLIC_REVIEW) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
