import type { Metadata } from "next";
import { share } from "@/lib/og";
import { MenuPage } from "@/components/MenuPage";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Non-Veg Menu: Biryani, Kebabs & Mutton Curries",
  description:
    "Order home-cooked chicken and mutton biryani, kebabs, nalli nihari, haleem and curries in Mumbai. Packs by the kilo and half dozen, made to order by Sabrina & Saniya. Order on WhatsApp.",
  alternates: { canonical: "/non-veg/" },
  ...share("/non-veg/", "/og/non-veg.jpg", "The Non-Vegetarian Collection, Our Family Table"),
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Non-Veg Menu", path: "/non-veg/" }])} />
      <MenuPage slug="non-veg" />
    </>
  );
}
