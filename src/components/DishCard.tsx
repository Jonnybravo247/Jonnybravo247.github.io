"use client";

import { useState, ViewTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { lineKey } from "@/lib/order";
import { plateSrc, rupee, type Dish } from "@/lib/menu";
import { Monogram } from "./Ornament";
import { Minus, Plus } from "./icons";
import { flyToBag } from "@/lib/fly";

const EASE = [0.16, 1, 0.3, 1] as const;

// Add button that becomes a stepper once the dish is in the order.
export function AddControl({ dish, option, flavour, compact = false }: { dish: Dish; option?: string | null; flavour?: string | null; compact?: boolean }) {
  const cart = useCart();
  const key = lineKey(dish.id, option ?? null, flavour ?? null);
  const n = cart.countOf(key);
  const min = dish.minPieces ?? 1;
  return (
    <div className={`add ${compact ? "add--compact" : ""}`}>
      <AnimatePresence initial={false} mode="popLayout">
        {n === 0 ? (
          <motion.button
            key="add"
            type="button"
            className="add__btn"
            onClick={(e) => (flyToBag(e.currentTarget), cart.add(dish, { option, flavour }))}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Plus width={16} height={16} />
            <span>Add{dish.minPieces ? ` ${dish.minPieces}` : ""}</span>
            <span className="sr">{dish.name}</span>
          </motion.button>
        ) : (
          <motion.div
            key="step"
            className="add__step"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <button type="button" onClick={() => cart.setCount(key, n - 1)} aria-label={n <= min ? `Remove ${dish.name}` : `One less ${dish.name}`}>
              <Minus width={16} height={16} />
            </button>
            <output aria-live="polite" aria-label={`${n} in your order`} className="roll">
              <AnimatePresence mode="popLayout" initial={false} custom={n}>
                <motion.span key={n} initial={{ y: "-90%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "90%", opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}>
                  {n}
                </motion.span>
              </AnimatePresence>
            </output>
            <button type="button" onClick={(e) => (flyToBag(e.currentTarget), cart.setCount(key, n + 1))} aria-label={`One more ${dish.name}`}>
              <Plus width={16} height={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chips({ label, values, value, onChange }: { label: string; values: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="chips" role="radiogroup" aria-label={label}>
      {values.map((v) => (
        <button key={v} type="button" role="radio" aria-checked={v === value} className="chip" onClick={() => onChange(v)}>
          {v}
        </button>
      ))}
    </div>
  );
}

export function DishCard({ dish, href }: { dish: Dish; href: string }) {
  const [option, setOption] = useState(dish.options?.[0].label ?? null);
  const [flavour, setFlavour] = useState(dish.flavours?.[0] ?? null);
  const price = option ? dish.options!.find((o) => o.label === option)!.price : dish.price;
  return (
    <article className="card">
      <Link href={href} className="card__tile" tabIndex={-1} aria-hidden>
        {dish.plate ? (
          <ViewTransition name={`plate-${dish.id}`} share="morph" default="none">
            <img src={plateSrc(dish.plate)} alt={`${dish.name}, illustrative photo`} width={900} height={900} loading="lazy" className="card__plate" />
          </ViewTransition>
        ) : (
          <span className="card__empty" aria-hidden>
            <Monogram />
          </span>
        )}
        {dish.signature && <span className="card__badge">Signature</span>}
      </Link>
      <div className="card__head">
        <h3 className="card__name">
          <ViewTransition name={`name-${dish.id}`} share="morph" default="none">
            <Link href={href} className="card__link">
              {dish.name}
            </Link>
          </ViewTransition>
          {dish.note && <span className="card__note"> {dish.note}</span>}
        </h3>
      </div>
      <p className="card__desc">
        {dish.desc}
        {dish.serve && <span className="card__serve"> Served with {dish.serve}.</span>}
      </p>
      {dish.flavours && <Chips label={`${dish.name} flavour`} values={dish.flavours} value={flavour!} onChange={setFlavour} />}
      {dish.options && <Chips label={`${dish.name} size`} values={dish.options.map((o) => o.label)} value={option!} onChange={setOption} />}
      <div className="card__foot">
        <div className="card__buy">
          <span className="card__price">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={price} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
                {rupee(price)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="card__qty">{dish.minPieces ? `${dish.qty}, min ${dish.minPieces}` : (dish.qty ?? "")}</span>
        </div>
        <AddControl dish={dish} option={option} flavour={flavour} />
      </div>
    </article>
  );
}
