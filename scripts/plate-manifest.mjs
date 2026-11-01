// Lists every dish that still needs a plate photo, with its generation
// prompt, into assets-src/plate-manifest.json. Photos already made are
// mapped in src/lib/menu.ts (DISH_PLATES) and skipped here.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const { menus } = JSON.parse(readFileSync(path.resolve(here, "../src/data/menu.json"), "utf8"));

// Dishes that reuse one of the first eleven plates.
export const EXISTING = {
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

const BRASS_PLATE = "hammered brass thali plate";
const BRASS_BOWL = "hammered brass bowl";
const BLACK_PLATE = "matte charcoal-black stoneware plate";
const SMALL_BOWL = "small hammered brass bowl";

function vessel(menu, section, name) {
  const n = name.toLowerCase();
  if (menu === "dips" && section !== "desserts") return BLACK_PLATE;
  if (section === "desserts") {
    if (/firni|kheer|pudding|rabdi|khurma/.test(n)) return SMALL_BOWL;
    return BRASS_PLATE;
  }
  if (/biryani|pulao|rice|zarda/.test(n)) return BRASS_PLATE;
  if (/gravies|delicacies|dals|home-classics/.test(section) || /curry|masala|keema|korma|kosha|razzala|gosht|haleem|khichda|nihari|dum pukht|kofta|paneer|dal|chole|rajma|chana|mashed/.test(n))
    return BRASS_BOWL;
  return BRASS_PLATE;
}

const prompt = (v, dish, dips) => {
  const bowl = /bowl/.test(v);
  const what = `${bowl ? "In it" : "On it"}: ${dish.name}${dish.flavours ? ` (${dish.flavours[0].toLowerCase()} style)` : ""}. ${dish.desc} ${dips ? "Spread in a generous swirl, made fresh in a home kitchen, with a light garnish that suits it." : "Plated generously as a home-cooked Indian family dish, with a light fresh garnish where it suits the dish."}`;
  return `Exact top-down overhead food photograph, camera directly above. A single round ${v} centred in the frame, the whole ${bowl ? "bowl" : "plate"} visible with generous empty margin on all sides (it fills about 78% of the frame width). ${what} Background is a perfectly flat, seamless, solid pure white (#FFFFFF), no tablecloth, no props, no other objects, very soft even shadow directly under the edge only. Soft natural daylight, rich appetising colour, high detail, editorial food photography.`;
};

const seen = new Set();
const out = [];
for (const m of menus) {
  for (const s of m.sections) {
    for (const g of s.groups) {
      for (const d of g.items) {
        if (seen.has(d.id) || EXISTING[d.id]) continue;
        seen.add(d.id);
        const v = vessel(m.slug, s.desserts ? "desserts" : s.id, d.name);
        const file = d.id;
        out.push({ file, name: d.name, done: existsSync(path.resolve(here, `../assets-src/plates/${file}.png`)), prompt: prompt(v, d, v === BLACK_PLATE) });
      }
    }
  }
}
writeFileSync(path.resolve(here, "../assets-src/plate-manifest.json"), JSON.stringify(out, null, 2));
console.log(`${out.length} dishes need plates, ${out.filter((o) => o.done).length} already generated`);
