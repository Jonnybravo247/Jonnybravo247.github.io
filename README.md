# Our Family Table

Website for Our Family Table, a mother and daughter home kitchen in Mumbai (Sabrina & Saniya).
Next.js static export: the whole site builds to plain files in `out/`.

- `npm run dev`: local site at http://localhost:3000
- `npm run build`: production build into `out/`
- `bash scripts/deploy-review.sh`: publish the client review copy to GitHub Pages (noindex)

Menu content and prices come from `src/data/menu.json`, generated from the printed-menu source
(`menu-build/data.js`) when the full project folder is present. Ordering happens on WhatsApp; there is
no database or payment step. Set `NEXT_PUBLIC_SITE_URL` to the client's domain for the live build.
