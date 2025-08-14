import ProductsView from '@/components/ProductsView';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import { getProductsByCategory } from '@/sanity/lib/products/getProductByCategory';
import React from 'react'

 async function CategorPage(
    {  params }: { params: Promise<{ slug: string }> }
 ) {
    const { slug } = await params;
    const products = await getProductsByCategory(slug);
    const categories = await getAllCategories(); 

 return (
  <div className="flex flex-col items-center justify-top min-h-screen p-10">
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md w-full max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}{" "}
        Collection
      </h1>
      <ProductsView products={products} />
    </div>
  </div>
);

}
export default CategorPage;