import ProductsView from "@/components/ProductsView";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getProductsByCategory } from "@/sanity/lib/products/getProductByCategory";

type AppPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: AppPageProps) {
  const { slug: rawSlug } = await params; 
  const slug = rawSlug.toLowerCase();

  const products =
    slug === "products" ? await getAllProducts() : await getProductsByCategory(slug);

  const title =
    slug === "products"
      ? "All Products"
      : slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") + " Collection";

  return (
    <div className="flex flex-col items-center min-h-screen p-10">
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
        <ProductsView products={products} />
      </div>
    </div>
  );
}
