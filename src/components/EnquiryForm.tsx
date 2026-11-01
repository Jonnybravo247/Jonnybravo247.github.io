"use client";

import { useId, useState } from "react";
import { Alert, WhatsApp } from "./icons";
import { DatePicker, Select } from "./Pickers";
import { plateSrc } from "@/lib/menu";
import { BRAND, LEAD_DAYS } from "@/lib/site";
import { earliestDate, prettyDate, whatsappLink } from "@/lib/order";

const OCCASIONS = ["Birthday", "Wedding or engagement", "Eid or festival", "House party", "Office lunch", "Something else"];
const FOOD = ["Non-veg", "Veg", "Both", "Dips and mezze"];

type F = { name: string; phone: string; occasion: string; date: string; guests: string; food: string; area: string; notes: string };
const blank: F = { name: "", phone: "", occasion: OCCASIONS[0], date: "", guests: "", food: FOOD[2], area: "", notes: "" };

// Party and bulk enquiries go to Saniya as one WhatsApp message.
export function EnquiryForm() {
  const uid = useId();
  const [f, setF] = useState<F>(blank);
  const [err, setErr] = useState<Partial<Record<keyof F, string>>>({});
  const [sent, setSent] = useState(false);
  const min = earliestDate("bulk");
  const id = (k: string) => `${uid}-${k}`;
  const set = (k: keyof F, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    if (err[k]) setErr((e) => ({ ...e, [k]: undefined }));
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const x: typeof err = {};
    if (!f.name.trim()) x.name = "Please tell us your name.";
    if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""))) x.phone = "Enter a 10-digit mobile number.";
    if (!f.date) x.date = "Choose the date of your event.";
    else if (f.date < min) x.date = `Party orders need ${LEAD_DAYS.bulk} days notice. The earliest date is ${prettyDate(min)}.`;
    if (!(Number(f.guests) > 0)) x.guests = "Roughly how many guests?";
    setErr(x);
    if (Object.keys(x).length) {
      (document.getElementById(id(Object.keys(x)[0])) as HTMLElement | null)?.focus();
      return;
    }
    const msg = [
      `Hello Saniya, I'd like to plan food for an event with ${BRAND}.`,
      "",
      "*Party enquiry*",
      `Occasion: ${f.occasion}`,
      `Date: ${prettyDate(f.date)}`,
      `Guests: about ${f.guests}`,
      `Food: ${f.food}`,
      ...(f.area.trim() ? [`Area: ${f.area.trim()}`] : []),
      ...(f.notes.trim() ? [`Notes: ${f.notes.trim()}`] : []),
      "",
      `Name: ${f.name.trim()}`,
      `Phone: ${f.phone.trim()}`,
    ].join("\n");
    window.open(whatsappLink(msg), "_blank", "noopener");
    setSent(true);
  };

  const Msg = ({ k }: { k: keyof F }) =>
    err[k] ? (
      <p className="field__msg" id={`${id(k)}-msg`} role="alert">
        <Alert width={16} height={16} /> {err[k]}
      </p>
    ) : null;

  return (
    <section id="enquiry" className="enquiry" aria-labelledby="enquiry-title">
      <div className="enquiry__card">
        <div className="enquiry__copy">
          <h2 id="enquiry-title" className="display sec-head__title">
            Planning a <em>party?</em>
          </h2>
          <p className="enquiry__lead">
            Tell us about your occasion and Saniya will help you choose dishes and quantities. Party and bulk orders need at least {LEAD_DAYS.bulk} days notice.
          </p>
          {sent ? (
            <div className="enquiry__sent" role="status">
              <WhatsApp width={32} height={32} />
              <p>
                <b>Your enquiry is ready in WhatsApp.</b> Press send there and Saniya will get back to you.
              </p>
              <button className="link-arrow" onClick={() => (setSent(false), setF(blank))}>
                Start another enquiry
              </button>
            </div>
          ) : (
            <form className="details enquiry__form" onSubmit={send} noValidate>
              <div className="row2">
                <div className={`field ${err.name ? "field--error" : ""}`}>
                  <label htmlFor={id("name")}>Name</label>
                  <input id={id("name")} autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err.name} />
                  <Msg k="name" />
                </div>
                <div className={`field ${err.phone ? "field--error" : ""}`}>
                  <label htmlFor={id("phone")}>Mobile number</label>
                  <input id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err.phone} />
                  <Msg k="phone" />
                </div>
              </div>
              <div className="row2">
                <div className="field">
                  <label htmlFor={id("occasion")}>Occasion</label>
                  <Select id={id("occasion")} value={f.occasion} options={OCCASIONS} onChange={(v) => set("occasion", v)} />
                </div>
                <div className={`field ${err.date ? "field--error" : ""}`}>
                  <label htmlFor={id("date")}>Date</label>
                  <DatePicker id={id("date")} min={min} value={f.date} onChange={(v) => set("date", v)} invalid={!!err.date} describedBy={err.date ? `${id("date")}-msg` : undefined} />
                  <Msg k="date" />
                </div>
              </div>
              <div className="row2">
                <div className={`field ${err.guests ? "field--error" : ""}`}>
                  <label htmlFor={id("guests")}>Number of guests</label>
                  <input id={id("guests")} type="number" inputMode="numeric" min={1} value={f.guests} onChange={(e) => set("guests", e.target.value)} aria-invalid={!!err.guests} />
                  <Msg k="guests" />
                </div>
                <div className="field">
                  <label htmlFor={id("food")}>Food</label>
                  <Select id={id("food")} value={f.food} options={FOOD} onChange={(v) => set("food", v)} />
                </div>
              </div>
              <div className="field">
                <label htmlFor={id("area")}>Area in Mumbai (optional)</label>
                <input id={id("area")} placeholder="e.g. Andheri West" value={f.area} onChange={(e) => set("area", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor={id("notes")}>Dishes you have in mind (optional)</label>
                <textarea id={id("notes")} rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} />
              </div>
              <button type="submit" className="btn btn--whatsapp">
                <WhatsApp width={20} height={20} /> <span>Send on WhatsApp</span>
              </button>
            </form>
          )}
        </div>
        <div className="enquiry__art" aria-hidden>
          <img src={plateSrc("pistachio-kunafa")} alt="" width={900} height={900} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
