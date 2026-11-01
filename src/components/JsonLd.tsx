import { allDishes, menus, MENU_META, type Menu } from "@/lib/menu";
import { BRAND, CITY, DESCRIPTION, PHONE_E164, SITE_URL } from "@/lib/site";

// Structured data so search engines and AI answers can read the kitchen,
// where it serves, and every dish with its price.
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const KITCHEN_ID = `${SITE_URL}/#kitchen`;

export const kitchenSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "@id": KITCHEN_ID,
  name: BRAND,
  description: DESCRIPTION,
  url: `${SITE_URL}/`,
  telephone: PHONE_E164,
  image: `${SITE_URL}/og.jpg`,
  servesCuisine: ["Indian", "Mughlai", "Hyderabadi", "Bengali", "Middle Eastern", "Mediterranean"],
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  address: { "@type": "PostalAddress", addressLocality: CITY, addressRegion: "Maharashtra", addressCountry: "IN" },
  areaServed: { "@type": "City", name: CITY },
  founder: [
    { "@type": "Person", name: "Sabrina" },
    { "@type": "Person", name: "Saniya" },
  ],
  hasMenu: menus.map((m) => `${SITE_URL}${MENU_META[m.slug].path}`),
  potentialAction: {
    "@type": "OrderAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/`, actionPlatform: ["https://schema.org/MobileWebPlatform", "https://schema.org/DesktopWebPlatform"] },
    deliveryMethod: ["http://purl.org/goodrelations/v1#DeliveryModeOwnFleet", "http://purl.org/goodrelations/v1#DeliveryModePickUp"],
  },
});

export const menuSchema = (m: Menu) => ({
  "@context": "https://schema.org",
  "@type": "Menu",
  "@id": `${SITE_URL}${MENU_META[m.slug].path}#menu`,
  name: `${BRAND}: ${m.label}`,
  url: `${SITE_URL}${MENU_META[m.slug].path}`,
  inLanguage: "en-IN",
  provider: { "@id": KITCHEN_ID },
  hasMenuSection: m.sections.map((s) => ({
    "@type": "MenuSection",
    name: s.title,
    ...(s.note ? { description: s.note } : {}),
    hasMenuItem: s.groups.flatMap((g) =>
      g.items.map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        description: d.desc,
        offers: (d.options ?? [{ label: d.qty ?? "", price: d.price }]).map((o) => ({
          "@type": "Offer",
          price: o.price,
          priceCurrency: "INR",
          ...(o.label ? { name: o.label } : {}),
        })),
        ...(m.slug === "veg" && !s.desserts ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
      })),
    ),
  })),
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
});

export const dishCount = () => menus.reduce((n, m) => n + allDishes(m).length, 0);
