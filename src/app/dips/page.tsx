import type { Metadata } from "next";
import { share } from "@/lib/og";
import { MenuPage } from "@/components/MenuPage";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Dips Menu: Hummus, Muhammara, Whipped Feta & More",
  description:
    "Fresh hummus, muhammara, baba ganoush, tzatziki, whipped feta and European dips in 200 gm jars, blended to order in Mumbai. The Deli Edit by Our Family Table. Order on WhatsApp.",
  alternates: { canonical: "/dips/" },
  ...share("/dips/", "/og/dips.jpg", "The Deli Edit, dips menu, Our Family Table"),
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Dips Menu", path: "/dips/" }])} />
      <MenuPage slug="dips" />
    </>
  );
}
