import ProductsView from '@/components/ProductsView';
import { getAllProducts } from '@/sanity/lib/products/getAllProducts';
import { getProductsByCategory } from '@/sanity/lib/products/getProductByCategory';
import React from 'react';

interface CategorPageProps {
  params: { slug: string };
}

async function CategorPage({ params }: CategorPageProps) {
  const { slug } = params;

  const products =
    slug === "products"
      ? await getAllProducts()
      : await getProductsByCategory(slug);

  return (
    <div className="flex flex-col items-center justify-top min-h-screen p-10">
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {slug === "Products"
            ? "All Products"
            : slug
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ") + " Collection"}
        </h1>
        <ProductsView products={products} />
      </div>
    </div>
  );
}

export default CategorPage;
