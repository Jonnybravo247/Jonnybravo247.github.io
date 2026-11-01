import type { Metadata, Viewport } from "next";
import { EB_Garamond, Jost, Pinyon_Script, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GroundController } from "@/components/GroundController";
import { SmoothScroll } from "@/components/SmoothScroll";
import { JsonLd, kitchenSchema } from "@/components/JsonLd";
import { ColorBall } from "@/components/ColorBall";
import { Reveal } from "@/components/Reveal";
import { GROUND_BOOT } from "@/lib/grounds";
import { BRAND, DESCRIPTION, SITE_URL } from "@/lib/site";
import "./globals.css";

// The printed menus' type, self-hosted at build time.
const display = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-display", display: "swap" });
const text = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"], variable: "--f-text", display: "swap" });
const label = Jost({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-label", display: "swap" });
const script = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--f-script", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} | Home-cooked biryani, kebabs & dips in Mumbai`,
    template: `%s | ${BRAND}, Mumbai`,
  },
  description: DESCRIPTION,
  applicationName: BRAND,
  keywords: [
    "home kitchen Mumbai",
    "home cooked food Mumbai",
    "biryani order Mumbai",
    "party food order Mumbai",
    "bulk food order Mumbai",
    "mutton nihari Mumbai",
    "hummus Mumbai",
    "Our Family Table",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: BRAND,
    title: `${BRAND} | A mother and daughter home kitchen in Mumbai`,
    description: DESCRIPTION,
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Our Family Table, home-cooked food in Mumbai" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: true },
  other: { "geo.region": "IN-MH", "geo.placename": "Mumbai" },
  ...(process.env.NEXT_PUBLIC_REVIEW ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-ground="white" suppressHydrationWarning className={`${display.variable} ${text.variable} ${label.variable} ${script.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: GROUND_BOOT }} />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <JsonLd data={kitchenSchema()} />
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <GroundController />
        <ColorBall />
        <Reveal />
        <SmoothScroll />
      </body>
    </html>
  );
}
