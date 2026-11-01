"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Chevron } from "./icons";
import { prettyDate } from "@/lib/order";

const EASE = [0.16, 1, 0.3, 1] as const;
const pop = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.22, ease: EASE },
};

// Closes a popover on outside click or Escape and hands focus back.
function useDismiss(open: boolean, close: () => void, root: React.RefObject<HTMLElement | null>, trigger: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => !root.current?.contains(e.target as Node) && close();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key, true);
    };
  }, [open, close, root, trigger]);
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const fromYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const WEEK = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DatePicker({
  id,
  value,
  min,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  min: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const start = value || min;
  const [view, setView] = useState(() => start.slice(0, 7));
  const [focus, setFocus] = useState(start);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), root, btn);

  useEffect(() => {
    if (open) {
      const s = value || min;
      setView(s.slice(0, 7));
      setFocus(s);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus();
  }, [open, focus, view]);

  const days = useMemo(() => {
    const first = fromYmd(`${view}-01`);
    const lead = (first.getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    return [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => `${view}-${String(i + 1).padStart(2, "0")}`)];
  }, [view]);

  const shift = (months: number) => {
    const d = fromYmd(`${view}-01`);
    d.setUTCMonth(d.getUTCMonth() + months);
    setView(ymd(d).slice(0, 7));
  };
  const canBack = `${view}-01` > min.slice(0, 7) + "-01";
  const move = (n: number) => {
    const d = fromYmd(focus);
    d.setUTCDate(d.getUTCDate() + n);
    const next = ymd(d) < min ? min : ymd(d);
    setFocus(next);
    if (next.slice(0, 7) !== view) setView(next.slice(0, 7));
  };
  const onKey = (e: React.KeyboardEvent) => {
    const k: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (k[e.key]) {
      e.preventDefault();
      move(k[e.key]);
    }
  };
  const monthName = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }).format(fromYmd(`${view}-01`));

  return (
    <div className="picker" ref={root}>
      <button
        ref={btn}
        id={id}
        type="button"
        className={`picker__btn ${value ? "" : "is-empty"}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value ? prettyDate(value) : "Choose a date"}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="pop cal" role="dialog" aria-label="Choose a date" {...pop}>
            <div className="cal__head">
              <button type="button" className="icon-btn" onClick={() => shift(-1)} disabled={!canBack} aria-label="Previous month">
                <Chevron dir="left" width={18} height={18} />
              </button>
              <span className="cal__month" aria-live="polite">
                {monthName}
              </span>
              <button type="button" className="icon-btn" onClick={() => shift(1)} aria-label="Next month">
                <Chevron width={18} height={18} />
              </button>
            </div>
            <div className="cal__week" aria-hidden>
              {WEEK.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div className="cal__grid" ref={grid} role="grid" onKeyDown={onKey}>
              {days.map((d, i) =>
                d ? (
                  <button
                    key={d}
                    type="button"
                    data-day={d}
                    className={`cal__day ${d === value ? "is-on" : ""} ${d === min ? "is-first" : ""}`}
                    disabled={d < min}
                    tabIndex={d === focus ? 0 : -1}
                    aria-pressed={d === value}
                    aria-label={prettyDate(d)}
                    onClick={() => {
                      onChange(d);
                      setOpen(false);
                      btn.current?.focus();
                    }}
                  >
                    {Number(d.slice(8))}
                  </button>
                ) : (
                  <span key={`x${i}`} />
                ),
              )}
            </div>
            <p className="cal__note">Earliest: {prettyDate(min)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Select({ id, value, options, onChange }: { id: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(Math.max(0, options.indexOf(value)));
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useDismiss(open, () => setOpen(false), root, btn);

  const pick = (i: number) => {
    onChange(options[i]);
    setOpen(false);
    btn.current?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setHi(Math.max(0, options.indexOf(value)));
      return setOpen(true);
    }
    if (!open) return;
    if (e.key === "ArrowDown") (e.preventDefault(), setHi((h) => Math.min(options.length - 1, h + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setHi((h) => Math.max(0, h - 1)));
    else if (e.key === "Enter" || e.key === " ") (e.preventDefault(), pick(hi));
    else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div className="picker" ref={root}>
      <button
        ref={btn}
        id={id}
        type="button"
        className="picker__btn"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-o${hi}` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        <span>{value}</span>
        <Chevron width={16} height={16} style={{ transform: `rotate(${open ? -90 : 90}deg)`, transition: "transform .3s" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul className="pop list" role="listbox" id={`${id}-list`} {...pop}>
            {options.map((o, i) => (
              <li
                key={o}
                id={`${id}-o${i}`}
                role="option"
                aria-selected={o === value}
                className={`list__opt ${i === hi ? "is-hi" : ""}`}
                onPointerEnter={() => setHi(i)}
                onClick={() => pick(i)}
              >
                {o}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
