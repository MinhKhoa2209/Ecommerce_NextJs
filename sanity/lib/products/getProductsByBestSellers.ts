import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByBestSellers = async () => {
  const BEST_SELLERS_QUERY = defineQuery(`
    *[
      _type == "product" &&
      count(*[
        _type == "order" &&
        references(^._id) &&
        defined(products[].review.rating)
      ]) > 0
    ]{
      ...,
      "avgRating": round(
        math::avg(
          *[
            _type == "order" &&
            references(^._id)
          ].products[].review.rating
        )
      )
    }
    | order(avgRating desc)[0...4]  
  `);

  try {
    const products = await sanityFetch({
      query: BEST_SELLERS_QUERY,
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return [];
  }
};
