// Real customer reviews only, quoted word for word with the client's permission.
// Entries marked `placeholder` show in development and never on the live site:
// replace them with reviews the client sends (WhatsApp screenshots are fine).
export type Testimonial = { quote: string; name: string; area?: string; placeholder?: boolean };

export const TESTIMONIALS: Testimonial[] = [
  { quote: "A real customer's words about the food go here, quoted exactly as they sent them.", name: "Customer name", area: "Area, Mumbai", placeholder: true },
  { quote: "A second real review goes here, ideally about a party or bulk order.", name: "Customer name", area: "Area, Mumbai", placeholder: true },
  { quote: "A third real review goes here, ideally about the dips or desserts.", name: "Customer name", area: "Area, Mumbai", placeholder: true },
];
