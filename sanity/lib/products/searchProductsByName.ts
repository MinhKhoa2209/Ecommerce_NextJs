import { sanityFetch } from "../live";
import { groq } from "next-sanity";

export const searchProductsByName = async (searchParam: string) => {
  const PRODUCT_SEARCH_QUERY = groq`
    *[_type == "product" && name match $searchParam] | order(name asc)
  `;

  try {
    const products = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: {
        searchParam: `${searchParam}*`
      }
    });

    return products.data || [];
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return [];
  }
};

export default searchProductsByName;