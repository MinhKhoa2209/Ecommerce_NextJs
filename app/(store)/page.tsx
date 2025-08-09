import BlackFridayBanner from "@/components/BlackFridayBanner";
import HotFeaturedProducts from "@/components/HotFeaturedProducts";
import ProductsView from "@/components/ProductsView";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getProductsByFeatured } from "@/sanity/lib/products/getProductsByFeatured";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const products = await getAllProducts();
  const featuredProducts = await getProductsByFeatured();
  console.log(
    crypto.randomUUID().slice(0, 5) +
      ` >>> Rerendered the home page cache with ${products.length} products`
  );

  return (
    <div>
      <BlackFridayBanner />
      <HotFeaturedProducts featuredProducts={featuredProducts} />
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100">
        <ProductsView products={products}  />
      </div>
    </div>
  );
}
