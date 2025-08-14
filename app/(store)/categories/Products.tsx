import ProductsView from '@/components/ProductsView';
import { getAllProducts } from '@/sanity/lib/products/getAllProducts';

import React from 'react';

async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="flex flex-col items-center justify-top min-h-screen p-10">
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center"> Products</h1>
        <ProductsView products={products} />
      </div>
    </div>
  );
}

export default ProductsPage;
