"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AddControl } from "./DishCard";
import { Chevron, Arrow } from "./icons";
import { HERO, MENU_META, PLATE_ALT, findDish, plateSrc, rupee } from "@/lib/menu";

const EASE = [0.16, 1, 0.3, 1] as const;
const DWELL = 7000;

// Outgoing plate turns on and slides away; the next one turns in from the
// opposite side. `dir` keeps the spin honest when stepping backwards.
const plate = {
  enter: (dir: number) => ({ x: dir > 0 ? "55%" : "-55%", y: dir > 0 ? "-18%" : "18%", rotate: dir > 0 ? -150 : 150, scale: 0.82, opacity: 0 }),
  center: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-38%" : "38%", y: dir > 0 ? "30%" : "-30%", rotate: dir > 0 ? 150 : -150, scale: 0.78, opacity: 0 }),
};
const still = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };

export function DishCarousel() {
  const reduce = useReducedMotion();
  const [[i, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const swipe = useRef<number | null>(null);

  const go = useCallback((n: number, d?: number) => {
    setState(([cur]) => {
      const next = (n + HERO.length) % HERO.length;
      return [next, d ?? (next > cur ? 1 : -1)];
    });
  }, []);

  const h = HERO[i];
  const dish = findDish(h.dish)!;
  const meta = MENU_META[h.menu];

  // Tell the page colour controller the hero's dish changed.
  useEffect(() => {
    window.dispatchEvent(new Event("ground:refresh"));
  }, [i]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    const vis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => (io.disconnect(), document.removeEventListener("visibilitychange", vis));
  }, []);

  const running = !reduce && !paused && visible;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => go(i + 1, 1), DWELL);
    return () => clearTimeout(t);
  }, [running, i, go]);

  // Warm the next plates so the turn never waits on the network.
  useEffect(() => {
    HERO.forEach((x) => {
      const img = new Image();
      img.src = plateSrc(x.plate);
    });
  }, []);

  const v = reduce ? still : plate;

  return (
    <section
      ref={ref}
      id="dishes"
      className="car"
      aria-roledescription="carousel"
      aria-label="Signature dishes"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="car__head">
        <h2 className="display sec-head__title car__title">
          Signature <em>dishes</em>
        </h2>
        <p className="car__lead">A few of the plates our family table is known for.</p>
      </div>
      <div
        className="car__stage"
        aria-hidden
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          const dx = e.clientX - (swipe.current ?? e.clientX);
          swipe.current = null;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        }}
      >
        <div className="car__orbit" />
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={h.plate}
            className="car__plate"
            custom={dir}
            variants={v}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0.4 : 0.95, ease: EASE }}
          >
            <img src={plateSrc(h.plate)} alt="" className="car__img" width={900} height={900} fetchPriority={i === 0 ? "high" : "auto"} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="car__copy">

        <div className="car__dish" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={h.dish} className="car__dish-inner" initial="in" animate="on" exit="out">
              <h3 className="car__name">
                {dish.name.split(" ").map((w, k) => (
                  <Fragment key={k}>
                    <span className="mask">
                      <motion.span variants={line(0.04 + k * 0.05)}>{w}</motion.span>
                    </span>{" "}
                  </Fragment>
                ))}
              </h3>
              <motion.p className="car__line" variants={line(0.2)}>
                {h.line}
              </motion.p>
              <motion.p className="car__price" variants={line(0.26)}>
                <span>{rupee(dish.price)}</span>
                <span className="car__qty">{dish.minPieces ? `${dish.qty}, min ${dish.minPieces}` : dish.qty}</span>
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="car__actions">
          <AddControl dish={dish} />
          <Link href={dish.id.startsWith("desserts") ? `${meta.path}#desserts` : meta.path} className="link-arrow">
            {dish.id.startsWith("desserts") ? "See the desserts" : `See the ${meta.short} menu`} <Arrow width={18} height={18} />
          </Link>
        </div>
      </div>

      <div className="rail">
        <button className="icon-btn rail__step" onClick={() => go(i - 1, -1)} aria-label="Previous dish">
          <Chevron dir="left" width={20} height={20} />
        </button>
        <div className="rail__plates" role="tablist" aria-label="Choose a dish">
          {HERO.map((x, k) => {
            const d = findDish(x.dish)!;
            return (
              <button key={x.plate} role="tab" aria-selected={k === i} className="rail__plate" onClick={() => go(k)} aria-label={d.name}>
                <img src={plateSrc(x.plate)} alt={PLATE_ALT[x.plate]} width={120} height={120} loading="lazy" />
                {k === i && running && <span className="rail__time" style={{ animationDuration: `${DWELL}ms` }} key={`t${i}`} />}
              </button>
            );
          })}
        </div>
        <button className="icon-btn rail__step" onClick={() => go(i + 1, 1)} aria-label="Next dish">
          <Chevron width={20} height={20} />
        </button>
      </div>
    </section>
  );
}

function line(delay: number) {
  return {
    in: { y: "105%", opacity: 0 },
    on: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE, delay } },
    out: { y: "-60%", opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const } },
  };
}
