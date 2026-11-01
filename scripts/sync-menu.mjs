// Copies the menu from the printed-menu source (menu-build/data.js) into
// src/data/menu.json, so the website, PDFs and PNGs always share one set of
// dishes and prices. Runs before `dev` and `build`.
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const source = path.resolve(here, "../../menu-build/data.js");
// Outside the full project folder (e.g. a fresh clone) the committed
// src/data/menu.json is used as it is.
if (!existsSync(source)) {
  console.log("menu-build/data.js not found; using the committed src/data/menu.json");
  process.exit(0);
}
const { nonveg, veg, dips, rice } = require(source);

// Dishes that use one of the first eleven plate photos; every other dish
// uses public/plates/<dish id>.webp once it has been generated.
const SHARED_PLATES = {
  "non-veg--chicken-bombay-biryani": "chicken-biryani",
  "non-veg--special-mutton-nalli-nihari": "mutton-nihari",
  "non-veg--chicken-malai-seekh": "kebab-platter",
  "non-veg--butter-chicken": "butter-chicken",
  "veg--paneer-butter-masala": "paneer-butter-masala",
  "veg--paneer-tikka-biryani": "paneer-tikka-biryani",
  "veg--dal-makhani": "dal-makhani",
  "dips--classic-hummus": "classic-hummus",
  "dips--muhammara": "muhammara",
  "dips--whipped-feta": "whipped-feta",
  "desserts--pistachio-cream-kunafa": "pistachio-kunafa",
};
const plateFor = (id) => {
  const f = SHARED_PLATES[id] ?? id;
  return existsSync(path.resolve(here, `../public/plates/${f}.webp`)) ? f : null;
};

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// "With bone 1000" -> { label: "With bone", price: 1000 }
const option = (s) => {
  const m = s.match(/^(.*) (\d+)$/);
  return { label: m[1], price: Number(m[2]) };
};

const item = (menuSlug, it, unitQty = null) => {
  const options = it.price2 ? it.price2.map(option) : null;
  // "Malai · Green · Red" is a flavour choice; other `var` text is a style note.
  const flavours = it.var && it.var.includes("·") ? it.var.split("·").map((s) => s.trim()) : null;
  const id = `${menuSlug}--${slug(it.name)}`;
  return {
    id,
    plate: plateFor(id),
    name: it.name,
    note: it.var && !flavours ? it.var : null,
    flavours,
    qty: it.qty && !it.qty.includes("·") ? it.qty : it.qty ? null : unitQty,
    price: Number(it.price),
    options,
    desc: it.desc,
    serve: it.serve || null,
    minPieces: it.min ? 6 : null,
    signature: !!it.signature,
  };
};

const section = (menu, pg) => {
  // Desserts and rice repeat across menus, so they share one cart id.
  const prefix = pg.title === "Desserts" ? "desserts" : pg.items === "rice" ? "rice" : menu.slug;
  // A printed page can carry a trailing group (`after`): rice gets its own
  // section on the web, anything else stays with its page.
  const raw = [...(pg.groups || [{ items: pg.items }])];
  if (pg.after && pg.after.items !== "rice") raw.push(pg.after);
  const groups = raw.map((g) => ({
    title: g.title || null,
    note: g.note || null,
    items: (g.items === "rice" ? rice : g.items).map((it) => item(prefix, it, pg.title !== "Desserts" && menu.unit ? "200 gm jar" : null)),
  }));
  return {
    id: slug(pg.title),
    title: pg.title,
    note: pg.note || null,
    foot: pg.foot || null,
    desserts: pg.title === "Desserts",
    groups,
  };
};

// On the website, desserts sit on the Non-Veg and Veg menus only.
const WEB_SKIP = { dips: ["Desserts"] };

const menus = [nonveg, veg, dips].map((m) => ({
  slug: m.slug,
  label: m.label,
  unit: m.unit || null,
  sections: m.pages.filter((pg) => !(WEB_SKIP[m.slug] ?? []).includes(pg.title)).flatMap((pg) =>
    pg.after && pg.after.items === "rice" ? [section(m, pg), section(m, { ...pg.after, title: pg.after.title })] : [section(m, pg)],
  ),
}));

// Fail loudly on a duplicate dish id inside one menu: the cart keys on it.
for (const m of menus) {
  const seen = new Set();
  for (const s of m.sections) for (const g of s.groups) for (const it of g.items) {
    if (seen.has(it.id)) throw new Error(`Duplicate dish id ${it.id}`);
    seen.add(it.id);
  }
}

const out = path.resolve(here, "../src/data/menu.json");
mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ menus }, null, 2));
console.log("menu synced:", menus.map((m) => `${m.slug} ${m.sections.length} sections`).join(", "));
