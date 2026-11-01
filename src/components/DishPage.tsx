import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "./BackLink";
import { DishBuy } from "./DishBuy";
import { DishCard } from "./DishCard";
import { DietMark, Monogram } from "./Ornament";
import { Arrow, Chevron } from "./icons";
import { JsonLd, breadcrumbs } from "./JsonLd";
import { MENU_META, canonicalMenu, dishPath, dishSlug, findEntry, menuEntries, plateSrc, rupee, type MenuSlug } from "@/lib/menu";
import { BRAND, CITY, CLIENTS_SERVED, LEAD_DAYS, SITE_URL } from "@/lib/site";

export const dishParams = (slug: MenuSlug) => menuEntries(slug).map((e) => ({ dish: dishSlug(e.dish.id) }));

export function dishMetadata(slug: MenuSlug, dish: string): Metadata {
  const e = findEntry(slug, dish);
  if (!e) return {};
  const d = e.dish;
  const pack = d.qty ? ` (${d.qty})` : "";
  const canon = dishPath(canonicalMenu(d, slug), d);
  return {
    title: `${d.name}${pack}, ${rupee(d.price)}`,
    description: `${d.desc} Home-cooked to order by Sabrina & Saniya in ${CITY}. ${rupee(d.price)}${pack}. Order on WhatsApp, ${LEAD_DAYS.regular} day ahead.`,
    alternates: { canonical: canon },
    openGraph: { url: canon, images: d.plate ? [{ url: plateSrc(d.plate), width: 900, height: 900, alt: d.name }] : undefined },
  };
}

export function DishPage({ slug, dish }: { slug: MenuSlug; dish: string }) {
  const e = findEntry(slug, dish);
  if (!e) notFound();
  const { dish: d, section } = e;
  const meta = MENU_META[slug];
  const veg = slug === "veg" && !section.desserts;
  // Other dishes from the same section, then the rest of the menu.
  const all = menuEntries(slug);
  const at = all.findIndex((x) => x.dish.id === d.id);
  const prev = all[(at - 1 + all.length) % all.length].dish;
  const next = all[(at + 1) % all.length].dish;
  const sectionHref = `${meta.path}#${section.id}`;
  const more = [
    ...menuEntries(slug).filter((x) => x.section.id === section.id && x.dish.id !== d.id),
    ...menuEntries(slug).filter((x) => x.section.id !== section.id),
  ]
    .slice(0, 4)
    .map((x) => x.dish);

  return (
    <div data-ground={meta.ground}>
      <JsonLd
        data={breadcrumbs([
          { name: "Home", path: "/" },
          { name: `${meta.short} Menu`, path: meta.path },
          { name: d.name, path: dishPath(slug, d) },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: d.name,
          description: d.desc,
          category: section.title,
          ...(d.plate ? { image: `${SITE_URL}${plateSrc(d.plate)}` } : {}),
          brand: { "@type": "Brand", name: BRAND },
          offers: (d.options ?? [{ label: d.qty ?? "", price: d.price }]).map((o) => ({
            "@type": "Offer",
            price: o.price,
            priceCurrency: "INR",
            ...(o.label ? { name: o.label } : {}),
            availability: "https://schema.org/PreOrder",
            areaServed: { "@type": "City", name: CITY },
            url: `${SITE_URL}${dishPath(slug, d)}`,
          })),
        }}
      />

      <article className="pdp">
        <div className="pdp__top">
          <BackLink href={sectionHref} label={`Back to ${section.title}`} />
          <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden>/</span>
          <Link href={meta.path}>{meta.short} menu</Link>
          <span aria-hidden>/</span>
          <Link href={sectionHref}>{section.title}</Link>
          </nav>
        </div>

        <div className="pdp__grid">
          <div className="pdp__stage">
            <div className="pdp__tile">
              <div className="pdp__orbit" aria-hidden />
              {d.plate ? (
                <img src={plateSrc(d.plate)} alt={`${d.name}, illustrative photo`} width={900} height={900} className="pdp__plate" fetchPriority="high" />
              ) : (
                <Monogram className="mono--xl" />
              )}
            </div>
            <p className="pdp__photo-note">Illustrative photo. Every dish is cooked fresh for your order.</p>
          </div>

          <div className="pdp__info">
            <h1 className="display pdp__name">{d.name}</h1>
            {(d.note || d.signature || veg) && (
              <p className="pdp__tags">
                {d.signature && <span className="tag">Signature</span>}
                {veg && (
                  <span className="pdp__veg">
                    <DietMark kind="veg" /> Vegetarian
                  </span>
                )}
                {d.note && <span className="pdp__note">{d.note}</span>}
              </p>
            )}
            <p className="pdp__desc">{d.desc}</p>
            {d.serve && (
              <p className="pdp__serve">
                Served with <b>{d.serve}</b>
              </p>
            )}

            <DishBuy dish={d} />

            <ul className="trust" aria-label="Why order from us">
              <li>
                <b>{CLIENTS_SERVED}</b>
                <span>families served across Mumbai</span>
              </li>
              <li>
                <b>Cooked fresh</b>
                <span>made only once you order</span>
              </li>
              <li>
                <b>{LEAD_DAYS.regular} day ahead</b>
                <span>bulk orders {LEAD_DAYS.bulk} days ahead</span>
              </li>
              <li>
                <b>Delivered</b>
                <span>or your own Porter or WeFast pickup</span>
              </li>
            </ul>
            {d.minPieces && <p className="pdp__fine">Per-piece desserts have a minimum order of {d.minPieces} pieces.</p>}
          </div>
        </div>
      </article>

      <nav className="pager" aria-label="More dishes">
        <Link href={dishPath(slug, prev)} className="pager__link pager__link--prev">
          <Chevron dir="left" width={20} height={20} />
          <span>
            <small>Previous dish</small>
            {prev.name}
          </span>
        </Link>
        <BackLink href={sectionHref} label={`Back to the ${meta.short} menu`} className="pager__back" />
        <Link href={dishPath(slug, next)} className="pager__link pager__link--next">
          <span>
            <small>Next dish</small>
            {next.name}
          </span>
          <Chevron width={20} height={20} />
        </Link>
      </nav>

      <section className="more" aria-labelledby="more-title">
        <div className="sec-head">
          <h2 id="more-title" className="display sec-head__title">
            From the same <em>table</em>
          </h2>
          <Link className="link-arrow" href={meta.path}>
            The full {meta.short} menu <Arrow width={18} height={18} />
          </Link>
        </div>
        <div className="cards more__cards">
          {more.map((x) => (
            <DishCard key={x.id} dish={x} href={dishPath(slug, x)} />
          ))}
        </div>
      </section>
    </div>
  );
}
