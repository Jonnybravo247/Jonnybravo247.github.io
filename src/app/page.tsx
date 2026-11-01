import { About, Faq, Hero, MenuDoors, Testimonials } from "@/components/HomeSections";
import { DishCarousel } from "@/components/DishCarousel";
import { EnquiryForm } from "@/components/EnquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/faq";

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema()} />
      <Hero />
      <MenuDoors />
      <About />
      <DishCarousel />
      <Testimonials />
      <Faq />
      <EnquiryForm />
    </>
  );
}
