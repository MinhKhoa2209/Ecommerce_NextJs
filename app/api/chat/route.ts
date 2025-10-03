import { NextResponse } from "next/server";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getProductsByNewArrivals } from "@/sanity/lib/products/getProductsByNewArrivals";
import { getProductsByFeatured } from "@/sanity/lib/products/getProductsByFeatured";
import { Product } from "@/sanity.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    // Lấy message cuối cùng
    const lastMsg: string = messages[messages.length - 1]?.content || "";
    const query = lastMsg.toLowerCase();

    // Lấy tất cả sản phẩm
    const products: Product[] = await getAllProducts();

    // Helper format product
    const formatProduct = (p: Product) =>
      `${p.name ?? "Unnamed"} - ${p.price ?? "N/A"}`;

    // 1. All products
    if (query.includes("all products")) {
      const productList = products.map(formatProduct).join("\n");
      return NextResponse.json({
        text: "Here are all the products:\n" + productList,
      });
    }

    // 2. New products
    if (query.includes("new products")) {
      const newProducts: Product[] = await getProductsByNewArrivals();
      if (!newProducts.length) {
        return NextResponse.json({ text: "No new products found." });
      }
      const productList = newProducts.map(formatProduct).join("\n");
      return NextResponse.json({
        text: "Here are the latest new products:\n" + productList,
      });
    }

    // 3. Hot products
    if (query.includes("hot products")) {
      const hotProducts: Product[] = await getProductsByFeatured();
      if (!hotProducts.length) {
        return NextResponse.json({ text: "No hot products found." });
      }
      const productList = hotProducts.map(formatProduct).join("\n");
      return NextResponse.json({
        text: "Here are the hot products:\n" + productList,
      });
    }

    // 4. Search theo tên
    const found = products.find(
      (p) => p.name && p.name.toLowerCase().includes(query)
    );

    if (found) {
      return NextResponse.json({
        text: `I found this product:\n${formatProduct(found)}`,
      });
    }

    // 5. Không tìm thấy
    return NextResponse.json({
      text: "Sorry, I couldn't find a matching product.",
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
