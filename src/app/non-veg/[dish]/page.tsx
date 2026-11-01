import { DishPage, dishMetadata, dishParams } from "@/components/DishPage";

export const dynamicParams = false;
export const generateStaticParams = () => dishParams("non-veg");

export async function generateMetadata({ params }: { params: Promise<{ dish: string }> }) {
  return dishMetadata("non-veg", (await params).dish);
}

export default async function Page({ params }: { params: Promise<{ dish: string }> }) {
  return <DishPage slug="non-veg" dish={(await params).dish} />;
}
