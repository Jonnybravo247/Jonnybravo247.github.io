// Site-wide facts. Change SITE_URL once the client's domain is bought.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ourfamilytable.in").replace(/\/$/, "");

export const BRAND = "Our Family Table";
export const OWNERS = "Sabrina & Saniya";
export const CITY = "Mumbai";

export const PHONE_DISPLAY = "87790 36821";
export const PHONE_E164 = "+918779036821";
export const WHATSAPP_NUMBER = "918779036821";

// Lead times from the client: regular orders 1 day ahead, bulk orders 3 days.
export const LEAD_DAYS = { regular: 1, bulk: 3 } as const;

export const TAGLINE = "Family recipes, cooked to order for Mumbai homes";
export const DESCRIPTION =
  "A mother and daughter home kitchen in Mumbai. Biryanis, kebabs, slow-cooked mutton, vegetarian classics, fresh dips and desserts, made to order and delivered across Mumbai. Order on WhatsApp.";

// From the client: customers served so far. Used as a trust signal; there are
// no per-dish counts, so never show a number for a single dish.
export const CLIENTS_SERVED = "500+";
