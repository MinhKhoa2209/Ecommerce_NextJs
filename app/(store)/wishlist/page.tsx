"use client";

import Link from "next/link";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { Button } from "@/components/ui/button";
import useStore from "@/store/store";
import { Heart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { favoriteProduct, removeFromFavorite, clearFavorite } = useStore();

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4 flex items-center gap-3">
          <span className="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text">
            Your Favorites
          </span>
          <span className="animate-pulse text-red-500 text-4xl">❤️</span>
        </h1>

        {favoriteProduct.length > 0 && (
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm hover:text-red-600"
            onClick={clearFavorite}
          >
            <Trash2 size={18} />
            Clear All
          </Button>
        )}
      </div>

      {favoriteProduct.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-16 h-16 mb-6 text-gray-400 opacity-70" />
          <h2 className="text-2xl font-semibold mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Looks like you have not added anything yet. Let us change that!
          </p>
          <Link href="/">
            <Button size="lg" className="px-6 py-2 rounded-full">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {favoriteProduct.map((product) => (
            <div
              key={product._id}
              className="group relative bg-white rounded-3xl border border-gray-300 shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
            >
              <Link href={`/product/${product.slug?.current}`}>
                <div className="relative w-full aspect-square  overflow-hidden">
                  {product.image && (
                    <Image
                      src={imageUrl(product.image).url()}
                      alt={product.name || "Product image"}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                  )}
                </div>
              </Link>

              <div className="p-5">
                <h2 className="text-lg font-bold mb-1 truncate">
                  {product.name}
                </h2>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description
                    ?.map((block) =>
                      block._type === "block"
                        ? block.children?.map((child) => child.text).join("")
                        : ""
                    )
                    .join(" ") || "No description available."}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-black">
                    ${product.price?.toFixed(2)}
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-red-600"
                    onClick={() => removeFromFavorite(product._id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
