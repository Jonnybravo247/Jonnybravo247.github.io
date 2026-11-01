"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// Weighted scrolling for the whole site; skipped for reduced motion.
export function SmoothScroll() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -120 } });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    });
    const lock = new MutationObserver(() => (document.documentElement.classList.contains("lock") ? lenis.stop() : lenis.start()));
    lock.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelAnimationFrame(id);
      lock.disconnect();
      lenis.destroy();
    };
  }, []);
  // New page starts at the top.
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [path]);
  return null;
}
