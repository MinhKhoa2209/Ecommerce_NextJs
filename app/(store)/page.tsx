import BlackFridayBanner from "@/components/BlackFridayBanner";
import CategoryCards from "@/components/CategoryCards";
import HeroProductSection from "@/components/HeroProductSection";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getProductsByBestSellers } from "@/sanity/lib/products/getProductsByBestSellers";

import { getProductsByFeatured } from "@/sanity/lib/products/getProductsByFeatured";
import { getProductsByNewArrivals } from "@/sanity/lib/products/getProductsByNewArrivals";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function Home() {
  const featuredProducts = await getProductsByFeatured();
  const newArrivals = await getProductsByNewArrivals();
  const bestSellers = await getProductsByBestSellers();
  const categories = await getAllCategories();
  return (
    <div>
      <BlackFridayBanner />
      <CategoryCards categories={categories} />

      <HeroProductSection
        products={bestSellers}
        title="Best Sellers"
        icon="🏆"
        gradient="from-yellow-500 via-orange-500 to-red-500"
      />

      <HeroProductSection
        products={featuredProducts}
        title="Hot Featured Products"
        icon="🔥"
        gradient="from-orange-500 via-pink-500 to-red-500"
      />

      <HeroProductSection
        products={newArrivals}
        title="New Arrivals"
        icon="🆕"
        gradient="from-blue-500 via-purple-500 to-pink-500"
      />
    </div>
  );
}
