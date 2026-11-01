// Adding a dish sends a small copy of its plate in an arc to the order bag
// (or the phone order bar), so the visitor sees where it went.
export function flyToBag(from: Element | null) {
  if (typeof window === "undefined" || !from) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const img = from.closest(".card, .pdp, .car, .mini")?.querySelector<HTMLImageElement>("img.card__plate, img.pdp__plate, img.car__img");
  const bar = document.querySelector<HTMLElement>(".orderbar");
  const target = bar && getComputedStyle(bar).display !== "none" ? bar : document.querySelector<HTMLElement>(".bag__icon");
  if (!img || !target) return;

  const a = img.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(a.width, 120);
  const x0 = a.left + a.width / 2 - size / 2;
  const y0 = a.top + a.height / 2 - size / 2;
  const x1 = b.left + b.width / 2 - size / 2;
  const y1 = b.top + b.height / 2 - size / 2;
  const lift = Math.min(160, Math.abs(y1 - y0) * 0.5 + 60);

  const ghost = img.cloneNode() as HTMLImageElement;
  ghost.removeAttribute("loading");
  Object.assign(ghost.style, {
    position: "fixed", left: "0", top: "0", width: `${size}px`, height: `${size}px`, zIndex: "120", pointerEvents: "none",
    filter: "drop-shadow(0 12px 16px rgb(0 0 0 / 0.3))", willChange: "transform, opacity",
  });
  document.body.appendChild(ghost);
  const mid = { x: (x0 + x1) / 2, y: Math.min(y0, y1) - lift };
  ghost
    .animate(
      [
        { transform: `translate(${x0}px, ${y0}px) scale(1) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${mid.x}px, ${mid.y}px) scale(0.6) rotate(140deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${x1}px, ${y1}px) scale(0.16) rotate(260deg)`, opacity: 0.2 },
      ],
      { duration: 820, easing: "cubic-bezier(0.5, 0, 0.2, 1)", fill: "forwards" },
    )
    .finished.finally(() => ghost.remove());
}
