"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cartTotal, lineKey, type CartLine } from "@/lib/order";
import type { Dish } from "@/lib/menu";

const STORE = "oft-cart-v1";

type Cart = {
  lines: CartLine[];
  count: number;
  total: number;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (d: Dish, opts?: { option?: string | null; flavour?: string | null }) => void;
  setCount: (key: string, n: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  countOf: (key: string) => number;
  pulse: number; // bumps on every add, so the bag can acknowledge it
};

const Ctx = createContext<Cart | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const loaded = useRef(false);

  // Storage can be blocked (private mode); the cart still works for the visit.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    loaded.current = true;
    setReady(true);
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback<Cart["add"]>((d, opts = {}) => {
    const option = opts.option ?? null;
    const flavour = opts.flavour ?? null;
    const key = lineKey(d.id, option, flavour);
    const price = option ? d.options!.find((o) => o.label === option)!.price : d.price;
    const min = d.minPieces ?? 1;
    setLines((ls) => {
      const hit = ls.find((l) => l.key === key);
      if (hit) return ls.map((l) => (l.key === key ? { ...l, count: l.count + 1 } : l));
      return [...ls, { key, id: d.id, name: d.name, unit: d.qty, option, flavour, price, count: min, min }];
    });
    setPulse((p) => p + 1);
  }, []);

  const setCount = useCallback((key: string, n: number) => {
    setLines((ls) => ls.flatMap((l) => (l.key !== key ? [l] : n < l.min ? [] : [{ ...l, count: n }])));
  }, []);
  const remove = useCallback((key: string) => setLines((ls) => ls.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Cart>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.count, 0),
      total: cartTotal(lines),
      ready,
      open,
      setOpen,
      add,
      setCount,
      remove,
      clear,
      countOf: (key) => lines.find((l) => l.key === key)?.count ?? 0,
      pulse,
    }),
    [lines, ready, open, add, setCount, remove, clear, pulse],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
