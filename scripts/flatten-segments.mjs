// Next 16 writes route-segment prefetch files as nested folders, e.g.
//   out/non-veg/__next.non-veg/__PAGE__.txt
// but the browser requests the flat name
//   out/non-veg/__next.non-veg.__PAGE__.txt
// Next's own server maps one to the other; static hosts (GitHub Pages,
// Hostinger, Firebase) do not. This copies every nested file to its flat
// name so client-side navigation works on any static host. Runs after build.
import { readdirSync, statSync, copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");
let copied = 0;

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const f of files(p)) {
        const flat = [name, ...path.relative(p, f).split(path.sep)].join(".");
        copyFileSync(f, path.join(dir, flat));
        copied++;
      }
    } else walk(p);
  }
}

walk(OUT);
console.log(`segment files flattened: ${copied}`);
