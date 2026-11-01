// Ornaments carried over from the printed menus: the S♥S monogram, the
// diamond rule, and the Indian veg / non-veg marks.

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span className={`mono ${className}`} aria-label="S and S">
      <span aria-hidden>S</span>
      <svg className="mono__heart" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 21s-7.4-4.5-9.5-9.1C1 8.6 2.9 4.6 6.7 4.6c2.2 0 3.6 1.2 4.3 2.5.7-1.3 2.1-2.5 4.3-2.5 3.8 0 5.7 4 4.2 7.3C19.4 16.5 12 21 12 21z" />
      </svg>
      <span aria-hidden>S</span>
    </span>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return (
    <svg className={`rule ${className}`} viewBox="0 0 320 14" aria-hidden>
      <line x1="0" y1="7" x2="142" y2="7" />
      <line x1="178" y1="7" x2="320" y2="7" />
      <path d="M160 1l6 6-6 6-6-6z" />
      <circle cx="148" cy="7" r="1.6" />
      <circle cx="172" cy="7" r="1.6" />
    </svg>
  );
}

export function DietMark({ kind }: { kind: "veg" | "nonveg" }) {
  const c = kind === "veg" ? "#1F8A3B" : "#A0301F";
  return (
    <svg className="diet" viewBox="0 0 24 24" role="img" aria-label={kind === "veg" ? "Vegetarian" : "Non-vegetarian"}>
      <rect x="1" y="1" width="22" height="22" rx="2" fill="#fff" stroke={c} strokeWidth="2" />
      {kind === "veg" ? <circle cx="12" cy="12" r="5.5" fill={c} /> : <path d="M12 6.5l6 10.5H6z" fill={c} />}
    </svg>
  );
}
