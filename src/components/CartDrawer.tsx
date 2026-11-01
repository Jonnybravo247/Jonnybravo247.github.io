"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { Alert, Close, Minus, Plus, WhatsApp } from "./icons";
import { DatePicker } from "./Pickers";
import { rupee } from "@/lib/menu";
import { LEAD_DAYS, PHONE_DISPLAY } from "@/lib/site";
import {
  earliestDate,
  lineLabel,
  prettyDate,
  validate,
  whatsappLink,
  whatsappMessage,
  type Errors,
  type OrderDetails,
} from "@/lib/order";

const EASE = [0.16, 1, 0.3, 1] as const;
const DETAILS = "oft-details-v1";

const blank: OrderDetails = { name: "", phone: "", orderType: "regular", date: "", time: "", fulfilment: "delivery", area: "", address: "", notes: "" };

function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; children: React.ReactNode; id: string }) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p className="field__msg" id={`${id}-msg`} role="alert">
          <Alert width={16} height={16} />
          {error}
        </p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-msg`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function CartDrawer() {
  const cart = useCart();
  const uid = useId();
  const [o, setO] = useState<OrderDetails>(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  // Remember the visitor's details (not the date) for their next order.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DETAILS);
      if (raw) setO((v) => ({ ...v, ...JSON.parse(raw), date: "", notes: "" }));
    } catch {}
  }, []);

  useEffect(() => {
    if (!cart.open) return;
    opener.current = document.activeElement;
    document.documentElement.classList.add("lock");
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cart.setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lock");
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [cart.open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof OrderDetails>(k: K, v: OrderDetails[K]) => {
    setO((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const min = earliestDate(o.orderType);

  const send = () => {
    const e = validate(cart.lines, o);
    setErrors(e);
    if (Object.values(e).some(Boolean)) {
      const first = panel.current?.querySelector<HTMLElement>(".field--error input, .field--error .picker__btn");
      first?.focus();
      return;
    }
    try {
      const { name, phone, area, address, fulfilment } = o;
      localStorage.setItem(DETAILS, JSON.stringify({ name, phone, area, address, fulfilment }));
    } catch {}
    window.open(whatsappLink(whatsappMessage(cart.lines, o)), "_blank", "noopener");
    setSent(true);
  };

  const id = (k: string) => `${uid}-${k}`;
  const desc = (k: keyof Errors) => (errors[k] ? `${id(k)}-msg` : undefined);

  return (
    <AnimatePresence>
      {cart.open && (
        <motion.div className="drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <button className="drawer__scrim" aria-label="Close your order" onClick={() => cart.setOpen(false)} tabIndex={-1} />
          <motion.div
            ref={panel}
            className="drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={id("title")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            data-lenis-prevent
          >
            <header className="drawer__head">
              <h2 id={id("title")}>Your order</h2>
              <button className="icon-btn" onClick={() => cart.setOpen(false)} aria-label="Close your order" data-autofocus>
                <Close width={22} height={22} />
              </button>
            </header>

            {sent ? (
              <div className="drawer__sent">
                <WhatsApp width={40} height={40} />
                <h3>Your order is ready in WhatsApp</h3>
                <p>
                  Press send in WhatsApp and Saniya will reply to confirm the order, delivery charge and timing. If WhatsApp did not open, message or call{" "}
                  <a href={`tel:+91${PHONE_DISPLAY.replace(/\s/g, "")}`}>{PHONE_DISPLAY}</a>.
                </p>
                <div className="drawer__sent-actions">
                  <button className="btn btn--solid" onClick={() => (cart.clear(), setSent(false), cart.setOpen(false))}>
                    Done, clear my order
                  </button>
                  <button className="btn btn--line" onClick={() => setSent(false)}>
                    Back to my order
                  </button>
                </div>
              </div>
            ) : cart.lines.length === 0 ? (
              <div className="drawer__empty">
                <p className="drawer__empty-lead">Your table is empty.</p>
                <p>Choose from the menus and your dishes will gather here.</p>
                <nav className="drawer__empty-links" aria-label="Menus">
                  <Link href="/non-veg/" onClick={() => cart.setOpen(false)}>Non-Veg</Link>
                  <Link href="/veg/" onClick={() => cart.setOpen(false)}>Veg</Link>
                  <Link href="/dips/" onClick={() => cart.setOpen(false)}>Dips</Link>
                </nav>
              </div>
            ) : (
              <>
                <div className="drawer__body">
                  <ul className="lines">
                    <AnimatePresence initial={false}>
                      {cart.lines.map((l) => (
                        <motion.li
                          key={l.key}
                          className="line"
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                        >
                          <div className="line__text">
                            <span className="line__name">{lineLabel(l)}</span>
                            <span className="line__meta">
                              {l.unit ? `${l.unit} · ` : ""}
                              {rupee(l.price)}
                            </span>
                          </div>
                          <div className="add__step add__step--small">
                            <button type="button" onClick={() => cart.setCount(l.key, l.count - 1)} aria-label={l.count <= l.min ? `Remove ${l.name}` : `One less ${l.name}`}>
                              <Minus width={14} height={14} />
                            </button>
                            <output>{l.count}</output>
                            <button type="button" onClick={() => cart.setCount(l.key, l.count + 1)} aria-label={`One more ${l.name}`}>
                              <Plus width={14} height={14} />
                            </button>
                          </div>
                          <span className="line__sum">{rupee(l.price * l.count)}</span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  <div className="total">
                    <span>Food total</span>
                    <strong>{rupee(cart.total)}</strong>
                  </div>
                  <p className="total__note">Delivery charges are extra and confirmed by Saniya on WhatsApp.</p>

                  <form className="details" onSubmit={(e) => (e.preventDefault(), send())} noValidate>
                    <h3>Your details</h3>
                    <fieldset className="seg">
                      <legend>Order type</legend>
                      {(["regular", "bulk"] as const).map((t) => (
                        <label key={t} className={`seg__opt ${o.orderType === t ? "is-on" : ""}`}>
                          <input type="radio" name="orderType" value={t} checked={o.orderType === t} onChange={() => set("orderType", t)} />
                          <span className="seg__title">{t === "regular" ? "Regular" : "Bulk"}</span>
                          <span className="seg__sub">
                            Order {LEAD_DAYS[t]} day{LEAD_DAYS[t] > 1 ? "s" : ""} ahead
                          </span>
                        </label>
                      ))}
                    </fieldset>

                    <div className="row2">
                      <Field id={id("date")} label="Date" error={errors.date} hint={`Earliest: ${prettyDate(min)}`}>
                        <DatePicker id={id("date")} min={min} value={o.date} onChange={(v) => set("date", v)} invalid={!!errors.date} describedBy={`${id("date")}-msg`} />
                      </Field>
                      <Field id={id("time")} label="Preferred time (optional)">
                        <input id={id("time")} type="text" placeholder="e.g. 1 pm, or dinner" value={o.time} onChange={(e) => set("time", e.target.value)} />
                      </Field>
                    </div>

                    <div className="row2">
                      <Field id={id("name")} label="Name" error={errors.name}>
                        <input id={id("name")} autoComplete="name" value={o.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={desc("name")} required />
                      </Field>
                      <Field id={id("phone")} label="Mobile number" error={errors.phone}>
                        <input id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxx xxxxx" value={o.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={desc("phone")} required />
                      </Field>
                    </div>

                    <fieldset className="seg">
                      <legend>Delivery or pickup</legend>
                      {(["delivery", "pickup"] as const).map((t) => (
                        <label key={t} className={`seg__opt ${o.fulfilment === t ? "is-on" : ""}`}>
                          <input type="radio" name="fulfilment" value={t} checked={o.fulfilment === t} onChange={() => set("fulfilment", t)} />
                          <span className="seg__title">{t === "delivery" ? "Deliver to me" : "I'll arrange pickup"}</span>
                          <span className="seg__sub">{t === "delivery" ? "Delivery charges apply" : "Through Porter or WeFast"}</span>
                        </label>
                      ))}
                    </fieldset>

                    <Field id={id("area")} label={o.fulfilment === "delivery" ? "Area in Mumbai" : "Pickup from (your area)"} error={errors.area}>
                      <input id={id("area")} autoComplete="address-level3" placeholder="e.g. Bandra West" value={o.area} onChange={(e) => set("area", e.target.value)} aria-invalid={!!errors.area} aria-describedby={desc("area")} required />
                    </Field>
                    {o.fulfilment === "delivery" && (
                      <Field id={id("address")} label="Full address (optional)">
                        <textarea id={id("address")} rows={2} autoComplete="street-address" value={o.address} onChange={(e) => set("address", e.target.value)} />
                      </Field>
                    )}
                    <Field id={id("notes")} label="Anything else? (optional)">
                      <textarea id={id("notes")} rows={2} placeholder="Spice level, occasion, number of guests" value={o.notes} onChange={(e) => set("notes", e.target.value)} />
                    </Field>
                    <button type="submit" hidden />
                  </form>
                </div>

                <footer className="drawer__foot">
                  <button className="btn btn--whatsapp" onClick={send}>
                    <WhatsApp width={20} height={20} />
                    <span>Send on WhatsApp</span>
                    <span className="btn__sum">{rupee(cart.total)}</span>
                  </button>
                  <p>Opens WhatsApp with your order typed out for Saniya. Nothing is charged here.</p>
                </footer>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
