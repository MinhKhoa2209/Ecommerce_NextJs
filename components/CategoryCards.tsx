"use client";

import { useRouter } from "next/navigation";
import { Category } from "@/sanity.types";
import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";

interface CategoryCardsProps {
  categories: Category[];
}

export default function CategoryCards({ categories }: CategoryCardsProps) {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category._id}
          onClick={() =>
            router.push(`/categories/${category.slug?.current || "products"}`)
          }
          className="relative group cursor-pointer rounded-full overflow-hidden border border-gray-300 shadow hover:shadow-lg transition-shadow bg-white aspect-square max-w-[300px] mx-auto"
        >
          {/* Background Image */}
          {category.image && (
            <Image
              src={imageUrl(category.image).url()}
              alt={category.title || "Category"}
              width={200}
              height={200}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Text & Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-xl font-bold">{category.title}</h3>
            <button className="mt-3 bg-white text-black px-4 py-2 rounded-md text-base font-semibold hover:bg-gray-200 transition">
              Shop Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
