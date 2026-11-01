import Link from "next/link";
import { Monogram, Rule } from "./Ornament";
import { Arrow, WhatsApp } from "./icons";
import { MENU_META, plateSrc, type MenuSlug } from "@/lib/menu";
import { SearchButton } from "./SearchPanel";
import { INDEX } from "@/lib/search";
import { FAQ } from "@/lib/faq";
import { TESTIMONIALS } from "@/data/testimonials";
import { CLIENTS_SERVED, LEAD_DAYS, WHATSAPP_NUMBER } from "@/lib/site";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="script hero__brand rise" style={d(0)}>
          Our Family Table
        </p>
        <h1 id="hero-title" className="hero__title">
          <span className="rise" style={d(80)}>
            Family recipes,
          </span>
          <em className="rise" style={d(160)}>
            cooked fresh
          </em>
          <span className="rise" style={d(240)}>
            for your table
          </span>
        </h1>
        <p className="hero__lead rise" style={d(340)}>
          A mother and daughter home kitchen in Mumbai. Biryanis, kebabs, slow-cooked mutton, vegetarian classics and fresh dips, made to order and delivered across
          the city.
        </p>
        <div className="hero__actions rise" style={d(420)}>
          <Link href="/non-veg/" className="btn btn--solid">
            Order now <Arrow width={18} height={18} />
          </Link>
          <a href="#menus" className="btn btn--line">
            Explore menus
          </a>
        </div>
      </div>
      <div className="hero__stage" aria-hidden>
        <div className="hero__orbit" />
        <img className="hero__plate" src={plateSrc("chicken-biryani")} alt="" width={900} height={900} fetchPriority="high" />
      </div>

      <ul className="facts" aria-label="How we cook">
        <li>
          <b>{CLIENTS_SERVED} families</b>
          <span>served across Mumbai</span>
        </li>
        <li>
          <b>Cooked to order</b>
          <span>Nothing waits on a shelf</span>
        </li>
        <li>
          <b>Order {LEAD_DAYS.regular} day ahead</b>
          <span>Bulk orders {LEAD_DAYS.bulk} days ahead</span>
        </li>
        <li>
          <b>Party sizes</b>
          <span>By the kilo and the half dozen</span>
        </li>
      </ul>
    </section>
  );
}

// Three doors into the coloured menus; each opens with the colour ball.
export function MenuDoors() {
  const doors: { slug: MenuSlug; plate: string; line: string }[] = [
    { slug: "non-veg", plate: "kebab-platter", line: "Kebabs, biryanis, mutton specialities" },
    { slug: "veg", plate: "paneer-butter-masala", line: "Paneer, dals, veg biryani, starters" },
    { slug: "dips", plate: "classic-hummus", line: "Hummus, mezze and European dips" },
  ];
  return (
    <section id="menus" className="doors" aria-labelledby="doors-title">
      <div className="sec-head">
        <h2 id="doors-title" className="display sec-head__title">
          Choose your <em>menu</em>
        </h2>
        <div className="doors__side">
          <p className="sec-head__lead">Handmade desserts come with the Non-Veg and Veg menus.</p>
          <SearchButton className="btn btn--line doors__search" label={`Search ${INDEX.length} dishes`} />
        </div>
      </div>
      <div className="doors__row">
        {doors.map((door) => {
          const m = MENU_META[door.slug];
          return (
            <Link key={door.slug} href={m.path} className={`door door--${m.ground}`}>
              <img src={plateSrc(door.plate)} alt="" width={900} height={900} loading="lazy" className="door__plate" />
              <span className="door__name">
                {m.title[0]} <em>{m.title[1]}</em>
              </span>
              <span className="door__line">{door.line}</span>
              <span className="door__go">
                Open menu <Arrow width={16} height={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <figure className="about__photo">
        <div className="about__arch">
          <img src="/photos/kebabs.webp" alt="A brass platter of kebabs, tikka and tandoori chicken with mint chutney" width={1100} height={733} loading="lazy" />
        </div>
        <div className="about__badge" aria-hidden>
          <b className="about__count">{CLIENTS_SERVED}</b>
          <span>families served</span>
        </div>
      </figure>
      <div className="about__copy">
        <h2 id="about-title" className="display sec-head__title">
          Where family recipes <em>meet your table</em>
        </h2>
        <Rule />
        <p className="about__lead">A mother and daughter, bringing generations of treasured family recipes to your celebrations.</p>
        <p>
          Every dish is lovingly prepared using recipes passed down through our ancestors, preserving authentic flavours, traditions and cherished memories. From our
          kitchen to your family table, we bring food that feels like home: handcrafted with love, care and the warmth of family in every bite.
        </p>
        <p className="about__sign">
          <span className="script">with love,</span> <span className="about__names">Sabrina &amp; Saniya</span>
        </p>
      </div>
    </section>
  );
}

export function Testimonials() {
  // Placeholders show only while developing; the live site shows real reviews only.
  const items = TESTIMONIALS.filter((t) => !t.placeholder || process.env.NODE_ENV !== "production");
  if (!items.length) return null;
  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="sec-head">
        <h2 id="reviews-title" className="display sec-head__title">
          Kind words from <em>our table</em>
        </h2>
      </div>
      <div className="reviews__row">
        {items.map((t, i) => (
          <figure key={i} className={`review ${t.placeholder ? "review--placeholder" : ""}`}>
            {t.placeholder && <span className="review__flag">Placeholder, replace with a real review</span>}
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <b>{t.name}</b>
              {t.area && <span>{t.area}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="faq__intro">
        <h2 id="faq-title" className="display sec-head__title">
          Questions, <em>answered</em>
        </h2>
        <p>Anything else, ask Saniya directly.</p>
        <a className="link-arrow" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener">
          <WhatsApp width={18} height={18} /> Message on WhatsApp
        </a>
      </div>
      <div className="faq__list">
        {FAQ.map((f) => (
          <details key={f.q} className="faq__item">
            <summary>
              <span>{f.q}</span>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
