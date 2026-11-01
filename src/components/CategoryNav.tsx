"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// The menu's sections: a sticky list beside the grid on desktop, a
// swipeable chip bar on phones. The current section is marked as you scroll.
export function CategoryNav({ items }: { items: { id: string; title: string; count: number }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const bar = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: true });

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const on = () => {
      const y = window.innerHeight * 0.35;
      let cur = items[0]?.id;
      for (const el of els) if (el.getBoundingClientRect().top <= y) cur = el.id;
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [items]);

  // Phones: keep the current chip in view and show which way there is more.
  useEffect(() => {
    const el = bar.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const b = bar.current;
    if (el && b && b.scrollWidth > b.clientWidth) b.scrollTo({ left: el.offsetLeft - 20, behavior: "smooth" });
  }, [active]);
  const onScroll = () => {
    const b = bar.current;
    if (b) setEdges({ start: b.scrollLeft > 4, end: b.scrollLeft + b.clientWidth < b.scrollWidth - 4 });
  };

  const jump = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o: object) => void } }).lenis;
    const offset = window.innerWidth > 1000 ? -110 : -170;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className={`cats ${edges.start ? "cats--start" : ""} ${edges.end ? "cats--end" : ""}`} aria-label="Menu sections">
      <p className="cats__heading label">On this menu</p>
      <div className="cats__scroll" ref={bar} onScroll={onScroll}>
        {items.map((i) => (
          <a key={i.id} href={`#${i.id}`} data-id={i.id} className="cats__link" aria-current={active === i.id ? "true" : undefined} onClick={(e) => jump(e, i.id)}>
            {active === i.id && <motion.span layoutId="cat-mark" className="cats__mark" transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />}
            <span className="cats__label">{i.title}</span>
            <span className="cats__count">{i.count}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
