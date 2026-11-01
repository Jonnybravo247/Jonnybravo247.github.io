import Link from "next/link";
import { Monogram, Rule } from "@/components/Ornament";

export default function NotFound() {
  return (
    <section className="lost">
      <Monogram className="mono--xl" />
      <h1 className="display">This plate is empty</h1>
      <Rule />
      <p>The page you were looking for is not on the table. The menus are a tap away.</p>
      <p className="lost__links">
        <Link href="/non-veg/">Non-Veg</Link>
        <Link href="/veg/">Veg</Link>
        <Link href="/dips/">Dips</Link>
        <Link href="/">Home</Link>
      </p>
    </section>
  );
}
