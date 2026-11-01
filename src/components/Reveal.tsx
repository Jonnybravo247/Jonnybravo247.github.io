"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Cards and headings rise gently into view, a few at a time. Content is
// visible by default; only browsers running this script hide it first.
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>(".card, .msec__head, .sec-head, .door, .review, .faq__item, .trust li, .facts li")];
    const vh = window.innerHeight;
    const pending = els.filter((el) => el.getBoundingClientRect().top > vh * 0.92);
    pending.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${Math.min(i++, 5) * 70}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
