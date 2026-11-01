import type { Metadata } from "next";
import { MenuPage } from "@/components/MenuPage";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Veg Menu: Paneer, Veg Biryani, Dal Makhani & Starters",
  description:
    "Order home-cooked vegetarian food in Mumbai: paneer tikka, paneer biryani, malai kofta, dal makhani and party starters, by the kilo. Made to order by Sabrina & Saniya. Order on WhatsApp.",
  alternates: { canonical: "/veg/" },
  openGraph: { url: "/veg/" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Veg Menu", path: "/veg/" }])} />
      <MenuPage slug="veg" />
    </>
  );
}
