"use client";

import Link from "next/link";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { HeartIcon } from "lucide-react";
import useStore from "@/store/store";
import useBasketStore from "@/store/store";
import { Product } from "@/sanity.types";
import { useCallback } from "react";
import { PortableText } from "next-sanity";
import { TrolleyIcon } from "@sanity/icons";

function useFavoriteLogic() {
  const favoriteProduct = useStore((state) => state.favoriteProduct);
  const addToFavorite = useStore((state) => state.addToFavorite);
  const removeFromFavorite = useStore((state) => state.removeFromFavorite);

  const isFavorited = useCallback(
    (productId: string) =>
      favoriteProduct.some((item) => item._id === productId),
    [favoriteProduct]
  );

  const toggleFavorite = useCallback(
    (product: Product) => {
      if (isFavorited(product._id!)) {
        removeFromFavorite(product._id!);
      } else {
        addToFavorite(product);
      }
    },
    [isFavorited, addToFavorite, removeFromFavorite]
  );

  return { isFavorited, toggleFavorite };
}

export default function HeroProductSection({
  products,
  title,
  icon,
  gradient,
}: {
  products: Product[];
  title: string;
  icon: string;
  gradient: string;
}) {
  const { isFavorited, toggleFavorite } = useFavoriteLogic();
  const { addItem } = useBasketStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-2">
          <span className="inline-block mr-1 text-5xl ">{icon}</span>
          <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const isOutOfStock = product.stock != null && product.stock <= 0;

          return (
            <div
              key={product._id}
              className={`bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                isOutOfStock ? "opacity-50" : ""
              }`}
            >
              <Link href={`/product/${product.slug?.current || ""}`}>
                <div className="relative aspect-square w-full overflow-hidden">
                  {product.image && (
                    <Image
                      src={imageUrl(product.image).url()}
                      alt={product.name || "Product image"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}

                  {/* Heart Icon overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isOutOfStock) toggleFavorite(product);
                    }}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:scale-110 transition-transform shadow-md"
                    aria-label="Add to wishlist"
                  >
                    <HeartIcon
                      className={`w-6 h-6 ${
                        isFavorited(product._id!)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400 fill-none"
                      }`}
                    />
                  </button>

                  {/* Out of Stock overlay */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <span className="text-white font-bold text-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-lg font-bold line-clamp-1">{product.name}</h3>
                <div className="text-gray-500 text-sm line-clamp-2">
                  {Array.isArray(product.description) && product.description.length > 0 ? (
                    <PortableText value={product.description} />
                  ) : (
                    "No description available."
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <p className="text-lg font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                    {product.price ? `$${product.price.toFixed(2)}` : "—"}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isOutOfStock) addItem(product);
                    }}
                    className={`p-2 rounded-full shadow-md transition-colors ${
                      isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    aria-label="Add to cart"
                    disabled={isOutOfStock}
                  >
                    <TrolleyIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
