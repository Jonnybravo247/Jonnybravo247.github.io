import { CategoryNav } from "./CategoryNav";
import { DishCard } from "./DishCard";
import { DietMark, Rule } from "./Ornament";
import { Download } from "./icons";
import { JsonLd, menuSchema } from "./JsonLd";
import {
  MENU_META,
  PLATE_ALT,
  dishPath,
  getMenu,
  plateSrc,
  type MenuSlug,
} from "@/lib/menu";
import { LEAD_DAYS } from "@/lib/site";

export function MenuPage({ slug }: { slug: MenuSlug }) {
  const menu = getMenu(slug);
  const meta = MENU_META[slug];
  return (
    <div data-ground={meta.ground}>
      <JsonLd data={menuSchema(menu)} />
      <section className="mhero">
        <div className="mhero__copy">
          <h1 className="display mhero__title">
            <span>{meta.title[0]}</span> <em>{meta.title[1]}</em>
          </h1>
          <Rule />
          <p className="mhero__line">{meta.line}</p>
          <p className="mhero__facts">
            {meta.diet && (
              <span className="mhero__diet">
                <DietMark kind={meta.diet} />{" "}
                {meta.diet === "veg" ? "Pure vegetarian" : "Non-vegetarian"}
              </span>
            )}
            {menu.unit && <span>{menu.unit}</span>}
            <span>
              Order {LEAD_DAYS.regular} day ahead, bulk {LEAD_DAYS.bulk} days
              ahead
            </span>
            <a href={meta.pdf} download className="mhero__pdf">
              <Download width={16} height={16} /> Printed menu (PDF)
            </a>
          </p>
        </div>
        <div className="mhero__stage">
          <img
            src={plateSrc(meta.plate)}
            alt={PLATE_ALT[meta.plate]}
            width={900}
            height={900}
            className="mhero__plate"
            fetchPriority="high"
          />
        </div>
      </section>

      <div className="mbody">
        <CategoryNav
          items={menu.sections.map((s) => ({
            id: s.id,
            title: s.title,
            count: s.groups.reduce((n, g) => n + g.items.length, 0),
          }))}
        />
        <div className="mbody__main">
          {menu.sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="msec"
              aria-labelledby={`${s.id}-t`}
            >
              <header className="msec__head">
                <h2 id={`${s.id}-t`} className="display msec__title">
                  {s.title}
                </h2>
                {s.note && <p className="msec__note">{s.note}</p>}
                {s.foot && <p className="msec__foot">{s.foot}</p>}
              </header>
              {s.groups.map((g, k) => (
                <div key={k} className="msec__group">
                  {g.title && (
                    <h3 className="gh">
                      <span>{g.title}</span>
                    </h3>
                  )}
                  <div className="cards">
                    {g.items.map((d) => (
                      <DishCard key={d.id} dish={d} href={dishPath(slug, d)} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
