import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByNewArrivals = async () => {
  // Lấy sản phẩm mới nhất theo ngày tạo (_createdAt)
  const NEW_ARRIVALS_QUERY = defineQuery(
    `*[_type == "product"] | order(_createdAt desc)[0...4]`
  );

  try {
    const products = await sanityFetch({
      query: NEW_ARRIVALS_QUERY,
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
};
