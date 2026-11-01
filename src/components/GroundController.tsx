"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { groundOf } from "@/lib/grounds";

// Keeps <html data-ground> in step with the route: white everywhere except
// the Non-Veg, Veg and Dips pages. The colour ball hides the switch.
export function GroundController() {
  const path = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.ground = groundOf(path);
    root.classList.add("gc");
    window.dispatchEvent(new Event("ground:set"));
  }, [path]);
  return null;
}
