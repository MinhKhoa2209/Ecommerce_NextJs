"use client";

import { Product } from "@/sanity.types";
import Link from "next/link";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import useStore from "@/store/store"; 
import { HeartIcon } from "@sanity/icons";

function ProductThumb({ product }: { product: Product }) {
  const isOutOfStock = product.stock != null && product.stock <= 0;

  const favoriteProduct = useStore((state) => state.favoriteProduct);
  const addToFavorite = useStore((state) => state.addToFavorite);
  const removeFromFavorite = useStore((state) => state.removeFromFavorite);

  const isFavorited = favoriteProduct.some((item) => item._id === product._id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (isFavorited) {
      removeFromFavorite(product._id);
    } else {
      addToFavorite(product);
    }
  };

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
        isOutOfStock ? "opacity-50" : ""
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {product.image && (
          <>
            <Image
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              src={imageUrl(product.image).url()}
              alt={product.name || "Product image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white font-bold text-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 text-left">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1 min-h-[28px]">
          {product.name}
        </h2>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : ""
            )
            .join(" ") || "No description available"}
        </p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ${product.price?.toFixed(2)}
          </p>
          <button
            onClick={toggleFavorite}
            className="transition-colors duration-200"
            aria-label="Add to wishlist"
          >
            <HeartIcon
              className={`w-6 h-6 ${
                isFavorited
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 fill-none"
              } hover:scale-110 transition-transform duration-200`}
            />
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductThumb;
