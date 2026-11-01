"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Arrow } from "./icons";

// Goes back to wherever the visitor came from on this site (keeping their
// scroll place in the menu); someone landing straight on a dish page from
// Google or WhatsApp goes to the dish's menu section instead.
export function BackLink({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      className={`back ${className}`}
      onClick={(e) => {
        let internal = false;
        try {
          internal = !!document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1;
        } catch {}
        if (internal) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      <Arrow width={18} height={18} style={{ transform: "scaleX(-1)" }} />
      <span>{label}</span>
    </Link>
  );
}
