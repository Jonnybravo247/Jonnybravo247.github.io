import type { Metadata } from "next";

// Link-preview images are 1200x630 JPEGs made by menu-build/og-images.js.
// A page that sets openGraph replaces the layout's block, so each page
// builds its full set here.
export function share(path: string, image: string, alt: string): Pick<Metadata, "openGraph" | "twitter"> {
  const images = [{ url: image, width: 1200, height: 630, alt, type: "image/jpeg" }];
  return {
    openGraph: { type: "website", locale: "en_IN", siteName: "Our Family Table", url: path, images },
    twitter: { card: "summary_large_image", images: [image] },
  };
}
