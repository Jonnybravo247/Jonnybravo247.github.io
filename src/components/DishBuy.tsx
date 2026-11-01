"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AddControl } from "./DishCard";
import { WhatsApp } from "./icons";
import { rupee, type Dish } from "@/lib/menu";
import { WHATSAPP_NUMBER } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

function Choice({ legend, values, value, onChange }: { legend: string; values: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="pdp__choice">
      <p className="label">{legend}</p>
      <div className="chips" role="radiogroup" aria-label={legend}>
        {values.map((v) => (
          <button key={v} type="button" role="radio" aria-checked={v === value} className="chip chip--lg" onClick={() => onChange(v)}>
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

// Price, choices and the add control for one dish page.
export function DishBuy({ dish }: { dish: Dish }) {
  const [option, setOption] = useState(dish.options?.[0].label ?? null);
  const [flavour, setFlavour] = useState(dish.flavours?.[0] ?? null);
  const price = option ? dish.options!.find((o) => o.label === option)!.price : dish.price;
  const ask = `Hello Saniya, I have a question about ${dish.name}${flavour ? ` (${flavour})` : ""}${option ? ` (${option})` : ""} from Our Family Table.`;
  return (
    <div className="pdp__buy">
      <p className="pdp__price">
        <span className="pdp__amount">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={price} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>
              {rupee(price)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="pdp__qty">{dish.minPieces ? `${dish.qty}, minimum ${dish.minPieces}` : (option ?? dish.qty)}</span>
      </p>
      {dish.flavours && <Choice legend="Flavour" values={dish.flavours} value={flavour!} onChange={setFlavour} />}
      {dish.options && <Choice legend="Size" values={dish.options.map((o) => o.label)} value={option!} onChange={setOption} />}
      <div className="pdp__actions">
        <AddControl dish={dish} option={option} flavour={flavour} label="Add to order" />
        <a className="link-arrow" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ask)}`} target="_blank" rel="noopener">
          <WhatsApp width={18} height={18} /> Ask Saniya about this dish
        </a>
      </div>
    </div>
  );
}
