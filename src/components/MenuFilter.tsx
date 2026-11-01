"use client";

import { useEffect, useRef, useState } from "react";
import { Close, Search as SearchIcon } from "./icons";
import { norm, openSearch } from "@/lib/search";

// Filters the dishes on one menu page in place; empty sections fold away.
export function MenuFilter({ menuName, total }: { menuName: string; total: number }) {
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(total);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = norm(q).split(" ").filter(Boolean);
    const res = words.map((w) => new RegExp(`(^| )${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    let count = 0;
    document.querySelectorAll<HTMLElement>(".msec").forEach((sec) => {
      const title = norm(sec.querySelector(".msec__title")?.textContent ?? "");
      let any = false;
      sec.querySelectorAll<HTMLElement>(".msec__group").forEach((grp) => {
        let inGroup = false;
        grp.querySelectorAll<HTMLElement>(".card").forEach((card) => {
          const text = `${card.dataset.text ?? ""} ${title}`;
          const ok = res.every((re) => re.test(text));
          card.hidden = !ok;
          if (ok) (count++, (inGroup = true));
        });
        grp.hidden = !inGroup;
        any ||= inGroup;
      });
      sec.hidden = !any;
    });
    setShown(count);
  }, [q]);

  const clear = () => setQ("");
  const typing = q.trim().length > 0;

  return (
    <div className="mfilter" ref={box}>
      <label className="mfilter__field">
        <SearchIcon width={20} height={20} />
        <span className="sr">Search the {menuName} menu</span>
        <input
          type="search"
          inputMode="search"
          placeholder={`Search the ${menuName} menu`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && clear()}
          autoComplete="off"
          spellCheck={false}
        />
        {typing && (
          <button type="button" className="icon-btn" onClick={clear} aria-label="Clear search">
            <Close width={18} height={18} />
          </button>
        )}
      </label>
      <p className="mfilter__status" aria-live="polite">
        {!typing ? (
          `${total} dishes`
        ) : shown ? (
          `${shown} of ${total} dishes`
        ) : (
          <>
            Nothing on this menu matches &ldquo;{q}&rdquo;.{" "}
            <button type="button" className="mfilter__all" onClick={() => openSearch(q)}>
              Search all menus
            </button>
          </>
        )}
      </p>
    </div>
  );
}
