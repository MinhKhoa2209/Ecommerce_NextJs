import { sanityFetch } from "../live";
import { defineQuery } from "next-sanity";

export const getRelatedProducts = async (categoryRef: string, excludeSlug: string) => {
  if (!categoryRef) return [];

  const RELATED_PRODUCTS_QUERY = defineQuery(`
    *[_type == "product" && $categoryRef in category[]._ref && slug.current != $excludeSlug][0...5]{
      _id,
      name,
      slug,
      price,
      image
    }
  `);

  try {
    const result = await sanityFetch({
      query: RELATED_PRODUCTS_QUERY,
      params: {
        categoryRef,
        excludeSlug,
      },
    });

    return result.data || [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};
