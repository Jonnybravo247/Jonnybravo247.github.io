"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { Monogram } from "./Ornament";
import { Bag, Search as SearchIcon } from "./icons";
import { rupee } from "@/lib/menu";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/non-veg/", label: "Non-Veg" },
  { href: "/veg/", label: "Veg" },
  { href: "/dips/", label: "Dips" },
  { href: "/contact/", label: "Contact" },
];

export function Header() {
  const path = usePathname();
  const cart = useCart();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Slide away while reading down, return on the first scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) setHidden(y > last && y > 240);
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header className={`top ${hidden ? "top--hidden" : ""} ${scrolled ? "top--scrolled" : ""}`} style={{ viewTransitionName: "site-header" }}>
        <Link href="/" className="top__brand" aria-label="Our Family Table, home">
          <Monogram />
          <span className="top__name">Our Family Table</span>
        </Link>
        <nav className="top__nav" aria-label="Main">
          {NAV.map((n) => {
            const on = n.href === "/" ? path === "/" : path.startsWith(n.href.slice(0, -1));
            return (
              <Link key={n.href} href={n.href} className="top__link" aria-current={on ? "page" : undefined}>
                {n.label}
                {on && <motion.span layoutId="nav-mark" className="top__mark" transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />}
              </Link>
            );
          })}
        </nav>
        <div className="top__tools">
        <button className="find" onClick={() => window.dispatchEvent(new CustomEvent("search:open", { detail: "" }))} aria-label="Search dishes" aria-keyshortcuts="Control+K /">
          <SearchIcon width={21} height={21} />
          <span className="find__label">Search</span>
        </button>
        <button className="bag" onClick={() => cart.setOpen(true)} aria-label={`Your order, ${cart.count} item${cart.count === 1 ? "" : "s"}`}>
          <motion.span key={cart.pulse} className="bag__icon" animate={cart.pulse ? { scale: [1, 1.22, 1] } : undefined} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <Bag width={22} height={22} />
          </motion.span>
          <span className="bag__label">Order</span>
          <AnimatePresence>
            {cart.ready && cart.count > 0 && (
              <motion.span className="bag__count" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                {cart.count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        </div>
      </header>

      {/* Phones: the order stays one thumb away once something is in it. */}
      <AnimatePresence>
        {cart.ready && cart.count > 0 && !cart.open && (
          <motion.button
            className="orderbar"
            onClick={() => cart.setOpen(true)}
            initial={{ y: "140%" }}
            animate={{ y: 0 }}
            exit={{ y: "140%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>
              View order <em>{cart.count} item{cart.count === 1 ? "" : "s"}</em>
            </span>
            <strong>{rupee(cart.total)}</strong>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
