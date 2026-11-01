// Page colour by route. Only the three menu pages are coloured; every other
// page sits on white.
export type Ground = "white" | "nonveg" | "veg" | "dips";

export const GROUNDS: Record<Ground, { color: string; ink: string; name: string | null }> = {
  white: { color: "#FFFFFF", ink: "#2A1714", name: null },
  nonveg: { color: "#4A0F1C", ink: "#F3E7D3", name: "Non-Veg" },
  veg: { color: "#1A3324", ink: "#F1E8D4", name: "Veg" },
  dips: { color: "#16130F", ink: "#F1E7D6", name: "Dips" },
};

export function groundOf(path: string): Ground {
  if (path.startsWith("/non-veg")) return "nonveg";
  if (path.startsWith("/veg")) return "veg";
  if (path.startsWith("/dips")) return "dips";
  return "white";
}

// Runs in <head> before first paint, so a menu page never flashes white.
export const GROUND_BOOT = `(function(){var p=location.pathname,g=p.indexOf('/non-veg')===0?'nonveg':p.indexOf('/veg')===0?'veg':p.indexOf('/dips')===0?'dips':'white';document.documentElement.dataset.ground=g;document.documentElement.classList.add('gc')})()`;
