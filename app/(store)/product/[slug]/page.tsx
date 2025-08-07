import AddToBasketButton from "@/components/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { getRelatedProducts } from "@/sanity/lib/products/getRelatedProducts";

import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const revalidate = 60;

async function ProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  console.log(
    crypto.randomUUID().slice(0, 5) +
      ` >>> Rerendered the product page cache for ${slug}`
  );

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stock! <= 0;
  const relatedProducts = await getRelatedProducts(
    product.category?.[0]?._ref || "",
    slug
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div
          className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 ${
            isOutOfStock ? "opacity-60" : ""
          }`}
        >
          {product.image && (
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name ?? "Product Image"}
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
            />
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <span className="text-red-400 font-extrabold text-2xl tracking-wide">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            <div className="text-3xl text-green-600 font-semibold mb-6">
              $
              {product.price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>

            <div className="border border-dashed border-blue-400 rounded-lg p-4 mt-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-blue-600 text-lg">🎁</span>
                <h2 className="text-blue-600 font-semibold text-lg uppercase">
                  Promotions & Offers
                </h2>
              </div>
              <ul className="list-disc pl-5 text-lg text-gray-700 space-y-1">
                <li>
                  Bank transfer required for orders from $500 and above
                  (mandatory)
                </li>
                <li>Free domestic shipping</li>
                <li>Support via official fanpage for all inquiries</li>
                <li>Direct discount already applied to product price</li>
                <li>Free return for any defective product</li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 inline-block pb-1">
                Description
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {Array.isArray(product.description) && (
                  <PortableText value={product.description} />
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <AddToBasketButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-24">
          <div className="relative mb-10">
            <hr className="border-t border-gray-300" />
            <h2 className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-4 text-3xl font-extrabold text-gray-900 tracking-wide">
              You may also like
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedProducts
              .filter(
                (item) =>
                  item &&
                  item.slug &&
                  item.slug.current &&
                  item.image &&
                  typeof item.price === "number"
              )
              .map((item) => (
                <div
                  key={item!._id}
                  className="flex flex-col items-center border rounded-lg p-4 hover:shadow-lg transition h-full"
                >
                  <Link
                    href={`/product/${item!.slug!.current}`}
                    className="flex flex-col items-center w-full h-full"
                  >
                    <div className="group w-full flex-1 flex items-center justify-center mb-3">
                      <Image
                        src={imageUrl(item!.image!).url()}
                        alt={item!.name || "Product"}
                        width={300}
                        height={300}
                        className="object-contain w-full h-40 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center w-full min-h-[2.5rem]">
                      {item!.name}
                    </h3>
                    <p className="text-green-600 font-bold text-center w-full mt-2">
                      ${item!.price?.toFixed(2)}
                    </p>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
