import data from "@/data/menu.json";
import type { Ground } from "./grounds";

export type MenuSlug = "non-veg" | "veg" | "dips";

export type Option = { label: string; price: number };
export type Dish = {
  id: string;
  plate: string | null;
  name: string;
  note: string | null;
  flavours: string[] | null;
  qty: string | null;
  price: number;
  options: Option[] | null;
  desc: string;
  serve: string | null;
  minPieces: number | null;
  signature: boolean;
};
export type Group = { title: string | null; note: string | null; items: Dish[] };
export type Section = { id: string; title: string; note: string | null; foot: string | null; desserts: boolean; groups: Group[] };
export type Menu = { slug: MenuSlug; label: string; unit: string | null; sections: Section[] };

export const menus = data.menus as Menu[];

export const getMenu = (slug: MenuSlug) => menus.find((m) => m.slug === slug)!;

export const allDishes = (m: Menu) => m.sections.flatMap((s) => s.groups.flatMap((g) => g.items));

export const findDish = (id: string) => {
  for (const m of menus) for (const d of allDishes(m)) if (d.id === id) return d;
  return undefined;
};

export const rupee = (n: number) => "₹" + n.toLocaleString("en-IN");

// How each menu reads on the web: names, page colour and its lead plate.
export const MENU_META: Record<
  MenuSlug,
  { path: string; ground: Ground; short: string; title: [string, string]; line: string; plate: string; diet: "veg" | "nonveg" | null; pdf: string }
> = {
  "non-veg": {
    path: "/non-veg/",
    ground: "nonveg",
    short: "Non-Veg",
    title: ["The Non-Vegetarian", "Collection"],
    line: "Kebabs, biryanis and slow-cooked curries from our family kitchen",
    plate: "chicken-biryani",
    diet: "nonveg",
    pdf: "/menus/our-family-table-non-veg-menu.pdf",
  },
  veg: {
    path: "/veg/",
    ground: "veg",
    short: "Veg",
    title: ["The Vegetarian", "Collection"],
    line: "Paneer, slow-simmered dals and home classics, made the way we make them at home",
    plate: "paneer-butter-masala",
    diet: "veg",
    pdf: "/menus/our-family-table-veg-menu.pdf",
  },
  dips: {
    path: "/dips/",
    ground: "dips",
    short: "Dips",
    title: ["The Deli", "Edit"],
    line: "Hummus, mezze and European dips, blended fresh in small batches",
    plate: "classic-hummus",
    diet: null,
    pdf: "/menus/our-family-table-dips-menu.pdf",
  },
};

// The plate photo that leads each section, where one exists.
export const SECTION_PLATES: Record<string, string> = {
  "non-veg/chicken-starters-and-kebabs": "kebab-platter",
  "non-veg/chicken-biryani-and-pulao": "chicken-biryani",
  "non-veg/chicken-gravies": "butter-chicken",
  "non-veg/our-special-mutton-delicacies": "mutton-nihari",
  "veg/veg-biryani-and-pulao": "paneer-tikka-biryani",
  "veg/veg-gravies": "paneer-butter-masala",
  "veg/dals-and-home-classics": "dal-makhani",
  "dips/signature-hummus": "classic-hummus",
  "dips/middle-eastern-and-mediterranean": "muhammara",
  "dips/european-signatures": "whipped-feta",
  "desserts": "pistachio-kunafa",
};

export const sectionPlate = (slug: MenuSlug, s: Section) =>
  s.desserts ? SECTION_PLATES.desserts : SECTION_PLATES[`${slug}/${s.id}`];

// Plates on the home carousel, each tied to a real dish on the menu.
export const HERO = [
  { plate: "chicken-biryani", dish: "non-veg--chicken-bombay-biryani", menu: "non-veg", ground: "nonveg", line: "Mumbai-style dum biryani, layered with saffron rice and tender chicken." },
  { plate: "paneer-butter-masala", dish: "veg--paneer-butter-masala", menu: "veg", ground: "veg", line: "Soft paneer in a rich, creamy tomato gravy." },
  { plate: "classic-hummus", dish: "dips--classic-hummus", menu: "dips", ground: "dips", line: "Silky, slow-blended chickpeas, made fresh to order." },
  { plate: "mutton-nihari", dish: "non-veg--special-mutton-nalli-nihari", menu: "non-veg", ground: "nonveg", line: "Slow-cooked overnight, the way our family has always made it." },
  { plate: "dal-makhani", dish: "veg--dal-makhani", menu: "veg", ground: "veg", line: "Black lentils simmered for hours, finished with butter and cream." },
  { plate: "pistachio-kunafa", dish: "desserts--pistachio-cream-kunafa", menu: "non-veg", ground: "white", line: "Crisp golden kunafa with a thick layer of pistachio cream." },
] as const satisfies ReadonlyArray<{ plate: string; dish: string; menu: MenuSlug; ground: Ground; line: string }>;

export const PLATE_ALT: Record<string, string> = {
  "chicken-biryani": "Chicken biryani on a brass plate, seen from above",
  "paneer-butter-masala": "Paneer butter masala in a brass bowl, seen from above",
  "classic-hummus": "Classic hummus with olive oil and chickpeas on a black plate",
  "mutton-nihari": "Mutton nalli nihari in a brass bowl, seen from above",
  "dal-makhani": "Dal makhani with cream and butter in a brass bowl",
  "pistachio-kunafa": "Pistachio cream kunafa on a brass plate",
  "kebab-platter": "Chicken malai seekh and tikka kebabs on a brass plate",
  "butter-chicken": "Butter chicken in a brass bowl, seen from above",
  "paneer-tikka-biryani": "Paneer tikka biryani on a brass plate",
  muhammara: "Muhammara red pepper and walnut dip on a black plate",
  "whipped-feta": "Whipped feta dip with honey and chilli on a black plate",
};

export const plateSrc = (p: string) => `/plates/${p}.webp`;

// Dish detail pages live under their menu: /non-veg/chicken-bombay-biryani/.
// Desserts and rice appear on several menus; their first menu is canonical.
export const dishSlug = (id: string) => id.split("--")[1];
export const dishPath = (menu: MenuSlug, d: Pick<Dish, "id">) => `${MENU_META[menu].path}${dishSlug(d.id)}/`;

export function menuEntries(slug: MenuSlug) {
  const m = getMenu(slug);
  return m.sections.flatMap((s) => s.groups.flatMap((g) => g.items.map((dish) => ({ dish, section: s }))));
}

export const findEntry = (slug: MenuSlug, dish: string) => menuEntries(slug).find((e) => dishSlug(e.dish.id) === dish);

export const canonicalMenu = (d: Dish, fallback: MenuSlug): MenuSlug =>
  d.id.startsWith("desserts--") || d.id.startsWith("rice--") ? "non-veg" : fallback;
