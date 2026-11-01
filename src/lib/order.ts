import { BRAND, LEAD_DAYS, WHATSAPP_NUMBER } from "./site";
import { rupee } from "./menu";

export type CartLine = {
  key: string;
  id: string;
  name: string;
  unit: string | null;
  option: string | null;
  flavour: string | null;
  price: number;
  count: number;
  min: number;
};

export type OrderType = keyof typeof LEAD_DAYS;

export type OrderDetails = {
  name: string;
  phone: string;
  orderType: OrderType;
  date: string; // yyyy-mm-dd
  time: string;
  fulfilment: "delivery" | "pickup";
  area: string;
  address: string;
  notes: string;
};

export const lineKey = (id: string, option: string | null, flavour: string | null) => [id, option ?? "", flavour ?? ""].join("|");

export const lineLabel = (l: Pick<CartLine, "name" | "option" | "flavour">) =>
  [l.name, l.flavour, l.option].filter(Boolean).join(", ");

export const cartTotal = (lines: CartLine[]) => lines.reduce((t, l) => t + l.price * l.count, 0);

// Today's date in Mumbai, as yyyy-mm-dd, whatever the visitor's clock zone.
export const todayInMumbai = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export const addDays = (ymd: string, n: number) => {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
};

export const earliestDate = (type: OrderType) => addDays(todayInMumbai(), LEAD_DAYS[type]);

export const prettyDate = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
};

export type Errors = Partial<Record<keyof OrderDetails | "cart", string>>;

export function validate(lines: CartLine[], o: OrderDetails): Errors {
  const e: Errors = {};
  if (!lines.length) e.cart = "Add at least one dish to your order.";
  if (!o.name.trim()) e.name = "Please tell us your name.";
  const digits = o.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) e.phone = "Enter a 10-digit mobile number.";
  const min = earliestDate(o.orderType);
  if (!o.date) e.date = "Choose a date for your order.";
  else if (o.date < min)
    e.date = `${o.orderType === "bulk" ? "Bulk" : "Regular"} orders need ${LEAD_DAYS[o.orderType]} day${LEAD_DAYS[o.orderType] > 1 ? "s" : ""} notice. The earliest date is ${prettyDate(min)}.`;
  if (!o.area.trim()) e.area = o.fulfilment === "delivery" ? "Which area of Mumbai should we deliver to?" : "Which area will the pickup come from?";
  return e;
}

export function whatsappMessage(lines: CartLine[], o: OrderDetails) {
  const rows = lines.map(
    (l, i) => `${i + 1}. ${lineLabel(l)}${l.unit ? ` (${l.unit})` : ""} x ${l.count} = ${rupee(l.price * l.count)}`,
  );
  const fulfil =
    o.fulfilment === "delivery"
      ? `Delivery to ${o.area.trim()}${o.address.trim() ? `\nAddress: ${o.address.trim()}` : ""}`
      : `I'll arrange pickup (Porter or WeFast) from ${o.area.trim()}`;
  return [
    `Hello Saniya, I'd like to place an order with ${BRAND}.`,
    "",
    "*Order*",
    ...rows,
    "",
    `*Food total: ${rupee(cartTotal(lines))}* (delivery charges extra)`,
    "",
    "*Details*",
    `Name: ${o.name.trim()}`,
    `Phone: ${o.phone.trim()}`,
    `Order type: ${o.orderType === "bulk" ? "Bulk" : "Regular"}`,
    `Date: ${prettyDate(o.date)}${o.time.trim() ? `, ${o.time.trim()}` : ""}`,
    fulfil,
    ...(o.notes.trim() ? [`Notes: ${o.notes.trim()}`] : []),
  ].join("\n");
}

export const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
