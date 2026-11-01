import Link from "next/link";
import { Monogram, Rule } from "./Ornament";
import { Download, Phone, WhatsApp } from "./icons";
import { MENU_META } from "@/lib/menu";
import { PHONE_DISPLAY, PHONE_E164, WHATSAPP_NUMBER } from "@/lib/site";

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot__sign">
        <Monogram className="mono--lg" />
        <p className="script">with love,</p>
        <p className="foot__names">Sabrina &amp; Saniya</p>
        <Rule />
      </div>
      <div className="foot__grid">
        <div>
          <h2 className="label">Order</h2>
          <p>
            Regular orders at least <b>1 day</b> ahead.
            <br />
            Bulk orders at least <b>3 days</b> ahead.
          </p>
          <p>Serving all across Mumbai. Delivery charges apply, or arrange your own pickup through Porter or WeFast.</p>
        </div>
        <div>
          <h2 className="label">Talk to Saniya</h2>
          <p className="foot__links">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">
              <WhatsApp width={18} height={18} /> WhatsApp {PHONE_DISPLAY}
            </a>
            <a href={`tel:${PHONE_E164}`}>
              <Phone width={18} height={18} /> Call {PHONE_DISPLAY}
            </a>
          </p>
        </div>
        <div>
          <h2 className="label">Menus</h2>
          <p className="foot__links">
            {(["non-veg", "veg", "dips"] as const).map((s) => (
              <Link key={s} href={MENU_META[s].path}>
                {MENU_META[s].short} menu
              </Link>
            ))}
            <Link href="/contact/">Contact &amp; questions</Link>
          </p>
        </div>
        <div>
          <h2 className="label">Printed menus</h2>
          <p className="foot__links">
            {(["non-veg", "veg", "dips"] as const).map((s) => (
              <a key={s} href={MENU_META[s].pdf} download>
                <Download width={18} height={18} /> {MENU_META[s].short} menu (PDF)
              </a>
            ))}
          </p>
        </div>
      </div>
      <p className="foot__base">
        <span>Our Family Table · A home kitchen in Mumbai</span>
        <span>Dish photographs are illustrative.</span>
      </p>
    </footer>
  );
}
