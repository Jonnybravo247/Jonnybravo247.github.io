"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GROUNDS, groundOf } from "@/lib/grounds";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Page transition between differently coloured pages: a ball of the next
// page's colour grows from the tap until it covers the screen, the route
// changes underneath it, then it lifts away.
export function ColorBall() {
  const router = useRouter();
  const path = usePathname();
  const pending = useRef<{ to: string; done: () => void } | null>(null);
  const busy = useRef(false);

  // Route arrived: let the covering ball go.
  useEffect(() => {
    const p = pending.current;
    if (p && path.replace(/\/$/, "") === p.to.replace(/\/$/, "").split("#")[0]) {
      pending.current = null;
      p.done();
    }
  }, [path]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const from = groundOf(location.pathname);
      const to = groundOf(url.pathname);
      if (from === to || busy.current) return;
      e.preventDefault();
      busy.current = true;
      play(url.pathname + url.hash, to, e.clientX || innerWidth / 2, e.clientY || innerHeight / 2, reduce.matches);
    };

    const play = (href: string, g: keyof typeof GROUNDS, x: number, y: number, still: boolean) => {
      const { color, ink, name } = GROUNDS[g];
      const ball = document.createElement("div");
      ball.className = "ball";
      ball.style.background = color;
      ball.style.color = ink;
      ball.setAttribute("aria-hidden", "true");
      ball.innerHTML = name
        ? `<span class="ball__mark">S<svg viewBox="0 0 24 24"><path d="M12 21s-7.4-4.5-9.5-9.1C1 8.6 2.9 4.6 6.7 4.6c2.2 0 3.6 1.2 4.3 2.5.7-1.3 2.1-2.5 4.3-2.5 3.8 0 5.7 4 4.2 7.3C19.4 16.5 12 21 12 21z"/></svg>S</span><span class="ball__name">The ${name} Menu</span>`
        : `<span class="ball__mark">S<svg viewBox="0 0 24 24"><path d="M12 21s-7.4-4.5-9.5-9.1C1 8.6 2.9 4.6 6.7 4.6c2.2 0 3.6 1.2 4.3 2.5.7-1.3 2.1-2.5 4.3-2.5 3.8 0 5.7 4 4.2 7.3C19.4 16.5 12 21 12 21z"/></svg>S</span>`;
      document.body.appendChild(ball);
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 40;
      const label = ball.querySelectorAll<HTMLElement>("span");

      const grow = still
        ? ball.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: "forwards" })
        : ball.animate(
            [
              { clipPath: `circle(0px at ${x}px ${y}px)` },
              { clipPath: `circle(${r}px at ${x}px ${y}px)` },
            ],
            { duration: 900, easing: EASE, fill: "forwards" },
          );
      if (!still)
        label.forEach((s, i) =>
          s.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }], {
            duration: 700,
            delay: 380 + i * 90,
            easing: EASE,
            fill: "both",
          }),
        );

      // Leave once the new page has mounted under the ball.
      const done = () => {
        window.scrollTo(0, 0);
        const wait = still ? 0 : 260;
        setTimeout(() => {
          label.forEach((s) => s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" }));
          const lift = still
            ? ball.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" })
            : ball.animate(
                [
                  { clipPath: `circle(${r}px at 50% 50%)`, opacity: 1 },
                  { clipPath: `circle(${r}px at 50% 50%)`, opacity: 0 },
                ],
                { duration: 650, delay: 120, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
              );
          lift.onfinish = () => {
            ball.remove();
            busy.current = false;
          };
        }, wait);
      };

      grow.onfinish = () => {
        const target = href.split("#")[0];
        if (location.pathname.replace(/\/$/, "") === target.replace(/\/$/, "")) return done();
        pending.current = { to: target, done };
        router.push(href, { scroll: false });
        // Never strand the visitor under the ball.
        setTimeout(() => {
          if (pending.current) {
            pending.current = null;
            done();
          }
        }, 4000);
      };
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
