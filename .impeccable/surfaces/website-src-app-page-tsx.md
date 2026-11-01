---
version: 1
slug: "website-src-app-page-tsx"
primary_target: "Website/src/app/page.tsx"
related_targets: ["Website/src/app/non-veg/page.tsx","Website/src/app/veg/page.tsx","Website/src/app/dips/page.tsx","Website/src/app/contact/page.tsx"]
---

# Home and menu pages (Persuade)

Scope: Website home (`/`), menu pages (`/non-veg/`, `/veg/`, `/dips/`), cart and checkout drawer, contact (`/contact/`). Visitor mode: Persuade. Menu pages and checkout behave as Operate inside the same world.

Audience and job: Mumbai families and hosts on phones, often arriving from a WhatsApp forward. Job: see real dishes with pack sizes and prices, build an order, send it to Saniya on WhatsApp with a valid date (regular 1 day ahead, bulk 3 days); or send a party enquiry.

Proof and content: the full menu with real prices from `menu-build/data.js`; the story and ordering copy from the printed menus. AI-generated plate photos for every dish (illustrative; replace with real photos later). Testimonials: only real reviews supplied by the client; placeholders render in development only and never ship.

Memorable moment: choosing a menu sends a ball of that menu's colour out from the tap until it fills the screen, and the menu opens inside it.

## Direction contract (revised 2026-11-01 by the user)

THESIS: A warm, white home kitchen storefront that opens into three coloured menu rooms. Home follows the user's chosen restaurant-template structure (Flavoria reference) set in the printed menus' type; the colour belongs only to the menu pages, so arriving in a menu feels like entering a room.

OWN-WORLD: White ground #FFFFFF with ivory #F6EFE3 bands and tiles, menu gold #A8834A hairlines and diamond rule, oxblood #6B1426 action colour. Menu pages take their whole page in Non-Veg #4A0F1C, Veg #1A3324 or Dips #16130F. Playfair Display headings and dish names, EB Garamond copy and every price, Jost tracked labels, Pinyon Script only for the brand name and sign-off. Round brass and black stoneware plates, cut out, on soft ivory tiles with round corners.

STORY: Hero says who they are and offers Order now and Explore menus. About proves the mother and daughter kitchen. The dish carousel shows signature plates with prices and Add. Testimonials (real only), FAQs, then a party and bulk enquiry form that becomes a WhatsApp message. Menu pages are a sweetgreen-style photo grid of every dish with Add.

FIRST VIEWPORT: White. Left: brand script, a three-line Playfair headline with one gold italic phrase, one line of copy, Order now (solid oxblood) and Explore menus (gold line). Right: a large brass plate turning slowly inside a gold orbit, bleeding off the right edge. Under the fold line, a quiet four-fact strip (cooked to order, 1 day ahead, across Mumbai, party orders by the kilo).

FORM: User-pinned composition (Flavoria home, sweetgreen product grid), adapted into the menu world; not rolled. Signature interaction: the colour ball page transition (expanding circle clip from the tap point, 900ms, cubic-bezier(0.16, 1, 0.3, 1), with the menu name set in Playfair italic at its centre), then the page settles in. Reduced motion: a short crossfade. seed: none (user-pinned composition, not rolled)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Final domain (single constant `SITE_URL`).
- Real testimonials from the client.
- Real food photography to replace the AI plates.
