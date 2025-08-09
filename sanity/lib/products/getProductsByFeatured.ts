import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByFeatured = async () => {
  const FEATURED_PRODUCTS_QUERY = defineQuery(
    `*[_type == "product" && isFeatured == true]| order(_createdAt desc)`
  );

  try {
    const products = await sanityFetch({
      query: FEATURED_PRODUCTS_QUERY,

    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};
