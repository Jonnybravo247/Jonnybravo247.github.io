import type { Metadata } from "next";
import { share } from "@/lib/og";
import { EnquiryForm } from "@/components/EnquiryForm";
import { JsonLd, breadcrumbs } from "@/components/JsonLd";
import { Monogram, Rule } from "@/components/Ornament";
import { Phone, WhatsApp } from "@/components/icons";
import { LEAD_DAYS, PHONE_DISPLAY, PHONE_E164, WHATSAPP_NUMBER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Ordering Questions",
  description:
    "Order home-cooked food in Mumbai on WhatsApp with Saniya, 87790 36821. Regular orders 1 day ahead, bulk orders 3 days ahead. Delivery across Mumbai, or pickup by Porter or WeFast.",
  alternates: { canonical: "/contact/" },
  ...share("/contact/", "/og/contact.jpg", "Talk to Saniya, Our Family Table"),
};

export default function Contact() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }])} />
      <section className="contact">
        <Monogram className="mono--xl" />
        <h1 className="display contact__title">
          <span>Talk to</span> <em>Saniya</em>
        </h1>
        <Rule />
        <p className="contact__lead">Orders, party menus and questions all go to one number, on WhatsApp or a call.</p>
        <a className="contact__number" href={`tel:${PHONE_E164}`}>
          {PHONE_DISPLAY}
        </a>
        <div className="contact__actions">
          <a className="btn btn--whatsapp" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">
            <WhatsApp width={20} height={20} /> <span>Message on WhatsApp</span>
          </a>
          <a className="btn btn--line" href={`tel:${PHONE_E164}`}>
            <Phone width={20} height={20} /> <span>Call Saniya</span>
          </a>
        </div>
        <dl className="terms">
          <div>
            <dt className="label">Advance booking</dt>
            <dd>
              Regular orders at least <b>{LEAD_DAYS.regular} day</b> ahead. Bulk orders at least <b>{LEAD_DAYS.bulk} days</b> ahead.
            </dd>
          </div>
          <div>
            <dt className="label">Serving</dt>
            <dd>All across Mumbai, from South Mumbai to the western and central suburbs.</dd>
          </div>
          <div>
            <dt className="label">Delivery</dt>
            <dd>Delivery charges apply. You may also arrange your own pickup through Porter or WeFast.</dd>
          </div>
        </dl>
      </section>

      <EnquiryForm />
    </>
  );
}
