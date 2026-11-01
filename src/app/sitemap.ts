import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { canonicalMenu, dishPath, menuEntries, type MenuSlug } from "@/lib/menu";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/non-veg/", priority: 0.9 },
    { path: "/veg/", priority: 0.9 },
    { path: "/dips/", priority: 0.9 },
    { path: "/contact/", priority: 0.7 },
  ];
  // One entry per dish, at its canonical menu.
  const dishes = new Set<string>();
  for (const m of ["non-veg", "veg", "dips"] as MenuSlug[])
    for (const { dish } of menuEntries(m)) if (canonicalMenu(dish, m) === m) dishes.add(dishPath(m, dish));
  return [...pages, ...[...dishes].map((path) => ({ path, priority: 0.6 }))].map((p) => ({ url: `${SITE_URL}${p.path}`, changeFrequency: "monthly", priority: p.priority }));
}
