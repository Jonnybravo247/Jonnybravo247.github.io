import { LEAD_DAYS } from "./site";

// Answers come straight from the client's ordering terms and menus.
export const FAQ = [
  {
    q: "How do I place an order?",
    a: "Add dishes to your order on this website and press Send on WhatsApp. Your order opens in WhatsApp already written for Saniya, who confirms it with you. You can also message or call Saniya on 87790 36821.",
  },
  {
    q: "How far in advance should I order?",
    a: `Regular orders need at least ${LEAD_DAYS.regular} day's notice. Bulk orders need at least ${LEAD_DAYS.bulk} days, because everything is cooked fresh to order.`,
  },
  {
    q: "Do you deliver across Mumbai?",
    a: "Yes, we serve all across Mumbai. Delivery charges apply and are confirmed on WhatsApp. You can also arrange your own pickup through Porter or WeFast.",
  },
  {
    q: "What sizes do dishes come in?",
    a: "Biryanis, pulaos and curries come in 1 kg packs. Most kebabs and starters come in packs of 6 pieces. Every dip is a 200 gm jar. Per-piece desserts have a minimum order of 6 pieces.",
  },
  {
    q: "Can you cook for a party or a large gathering?",
    a: `Yes. Send us a party enquiry or choose Bulk when you order, at least ${LEAD_DAYS.bulk} days ahead. Tell us the number of guests and Saniya will help with quantities.`,
  },
  {
    q: "Who cooks the food?",
    a: "Our Family Table is a mother and daughter home kitchen run by Sabrina and Saniya, cooking recipes passed down through their family.",
  },
];

export const faqSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
