"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Close, Search as SearchIcon, WhatsApp } from "./icons";
import { INDEX, SUGGESTIONS, search } from "@/lib/search";
import { plateSrc, rupee, type MenuSlug } from "@/lib/menu";
import { WHATSAPP_NUMBER } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;
const TABS: { id: MenuSlug | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "non-veg", label: "Non-Veg" },
  { id: "veg", label: "Veg" },
  { id: "dips", label: "Dips" },
];

// Site-wide dish search. Opens from the header, the home page, Ctrl+K or "/".
export function SearchPanel() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<MenuSlug | "all">("all");
  const [hi, setHi] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      opener.current = document.activeElement;
      setQ((e as CustomEvent<string>).detail || "");
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable;
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        opener.current = document.activeElement;
        setOpen(true);
      }
    };
    window.addEventListener("search:open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("search:open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("lock");
    const t = setTimeout(() => input.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.documentElement.classList.remove("lock");
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  const hits = useMemo(() => search(q, tab), [q, tab]);
  useEffect(() => setHi(0), [q, tab]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${hi}"]`)?.scrollIntoView({ block: "nearest" });
  }, [hi]);

  const close = () => setOpen(false);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (!hits.length) return;
    if (e.key === "ArrowDown") (e.preventDefault(), setHi((h) => Math.min(hits.length - 1, h + 1)));
    if (e.key === "ArrowUp") (e.preventDefault(), setHi((h) => Math.max(0, h - 1)));
    // Enter clicks the result link, so the colour ball still plays.
    if (e.key === "Enter") (e.preventDefault(), list.current?.querySelector<HTMLAnchorElement>(`[data-i="${hi}"] a`)?.click());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <button className="search__scrim" aria-label="Close search" tabIndex={-1} onClick={close} />
          <motion.div
            className="search__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search dishes"
            initial={{ y: -24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            onKeyDown={onKey}
            data-lenis-prevent
          >
            <div className="search__bar">
              <SearchIcon width={24} height={24} />
              <input
                ref={input}
                type="search"
                inputMode="search"
                className="search__input"
                placeholder={`Search ${INDEX.length} dishes`}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                role="combobox"
                aria-expanded={hits.length > 0}
                aria-controls="search-results"
                aria-activedescendant={hits.length ? `search-hit-${hi}` : undefined}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
              />
              <button className="icon-btn" onClick={close} aria-label="Close search">
                <Close width={22} height={22} />
              </button>
            </div>
            <div className="search__tabs" role="tablist" aria-label="Menu">
              {TABS.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} className="chip" onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {!q.trim() ? (
              <div className="search__idle">
                <p className="label">Try</p>
                <div className="search__suggest">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="chip" onClick={() => setQ(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : hits.length === 0 ? (
              <div className="search__none">
                <p>
                  No dishes match <b>&ldquo;{q}&rdquo;</b>
                  {tab !== "all" ? " on this menu" : ""}.
                </p>
                <a className="link-arrow" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Saniya, do you make ${q}?`)}`} target="_blank" rel="noopener">
                  <WhatsApp width={18} height={18} /> Ask Saniya if she can make it
                </a>
              </div>
            ) : (
              <>
                <p className="search__count" aria-live="polite">
                  {hits.length} dish{hits.length === 1 ? "" : "es"}
                </p>
                <ul className="search__list" id="search-results" role="listbox" ref={list}>
                  {hits.map((h, i) => (
                    <motion.li
                      key={h.id}
                      id={`search-hit-${i}`}
                      data-i={i}
                      role="option"
                      aria-selected={i === hi}
                      className={`hit ${i === hi ? "is-hi" : ""}`}
                      onPointerEnter={() => setHi(i)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: EASE, delay: Math.min(i, 8) * 0.025 }}
                    >
                      <Link href={h.path} className="hit__link" onClick={close} tabIndex={-1}>
                        <span className={`hit__tile hit__tile--${h.menu}`}>{h.plate && <img src={plateSrc(h.plate)} alt="" width={120} height={120} loading="lazy" />}</span>
                        <span className="hit__text">
                          <span className="hit__name">{h.name}</span>
                          <span className="hit__meta">
                            {h.menuShort} · {h.section}
                          </span>
                        </span>
                        <span className="hit__price">
                          {rupee(h.price)}
                          {h.qty && <small>{h.qty}</small>}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
            <p className="search__keys" aria-hidden>
              <kbd>↑</kbd>
              <kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SearchButton({ className = "", label = "Search" }: { className?: string; label?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent("search:open", { detail: "" }))}>
      <SearchIcon width={20} height={20} />
      <span>{label}</span>
    </button>
  );
}
