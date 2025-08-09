import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const categories = await getAllCategories();
  return <HeaderClient categories={categories} />;
}
