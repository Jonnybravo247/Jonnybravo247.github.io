import { MENU_META, canonicalMenu, dishPath, menus, type MenuSlug } from "./menu";

export type Hit = {
  id: string;
  name: string;
  desc: string;
  section: string;
  menu: MenuSlug;
  menuShort: string;
  price: number;
  qty: string | null;
  plate: string | null;
  path: string;
  text: string;
};

export const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9 ]+/g, " ");

// Every dish once; desserts and rice sit under their canonical menu.
export const INDEX: Hit[] = (() => {
  const seen = new Set<string>();
  const out: Hit[] = [];
  for (const m of menus)
    for (const s of m.sections)
      for (const g of s.groups)
        for (const d of g.items) {
          if (seen.has(d.id)) continue;
          seen.add(d.id);
          const menu = canonicalMenu(d, m.slug);
          const veg = m.slug === "veg" ? "vegetarian veg" : m.slug === "non-veg" ? "non veg nonveg" : "dip dips";
          out.push({
            id: d.id,
            name: d.name,
            desc: d.desc,
            section: s.title,
            menu,
            menuShort: MENU_META[menu].short,
            price: d.options ? d.options[0].price : d.price,
            qty: d.options ? d.options[0].label : d.qty,
            plate: d.plate,
            path: dishPath(menu, d),
            text: norm([d.name, d.note, d.flavours?.join(" "), s.title, g.title, d.desc, d.serve, veg].filter(Boolean).join(" ")),
          });
        }
  return out;
})();

// Every word must match the start of a word in the dish's text; dishes
// whose name matches rank first.
export function search(q: string, menu: MenuSlug | "all" = "all", limit = 40): Hit[] {
  const words = norm(q).split(" ").filter(Boolean);
  const pool = menu === "all" ? INDEX : INDEX.filter((h) => h.menu === menu);
  if (!words.length) return [];
  const scored: { h: Hit; score: number }[] = [];
  for (const h of pool) {
    const name = norm(h.name);
    let score = 0;
    let ok = true;
    for (const w of words) {
      const re = new RegExp(`(^| )${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      if (re.test(name)) score += 3;
      else if (re.test(h.text)) score += 1;
      else {
        ok = false;
        break;
      }
    }
    if (ok) scored.push({ h, score: score + (name.startsWith(words[0]) ? 2 : 0) });
  }
  return scored.sort((a, b) => b.score - a.score || a.h.name.localeCompare(b.h.name)).slice(0, limit).map((x) => x.h);
}

export const SUGGESTIONS = ["Biryani", "Kebab", "Mutton", "Paneer", "Hummus", "Dal", "Dessert", "Prawns"];

// Tells the search panel to open (header button, home and 404 buttons).
export const openSearch = (q = "") => window.dispatchEvent(new CustomEvent("search:open", { detail: q }));
