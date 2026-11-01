import { DishPage, dishMetadata, dishParams } from "@/components/DishPage";

export const dynamicParams = false;
export const generateStaticParams = () => dishParams("dips");

export async function generateMetadata({ params }: { params: Promise<{ dish: string }> }) {
  return dishMetadata("dips", (await params).dish);
}

export default async function Page({ params }: { params: Promise<{ dish: string }> }) {
  return <DishPage slug="dips" dish={(await params).dish} />;
}
