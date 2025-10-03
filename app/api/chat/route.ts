import { NextResponse } from "next/server";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getProductsByNewArrivals } from "@/sanity/lib/products/getProductsByNewArrivals";
import { getProductsByFeatured } from "@/sanity/lib/products/getProductsByFeatured";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    // Lấy message cuối cùng của user
    const lastMsg = messages[messages.length - 1]?.content || "";
    const query = lastMsg.toLowerCase();

    // Fetch tất cả sản phẩm
    const products = await getAllProducts();

    // ===============================
    // 1. Nếu user gõ "all products"
    // ===============================
    if (query.includes("all products")) {
      const productList = products
        .map((p: any) => `${p.name} - ${p.price}`)
        .join("\n");
      return NextResponse.json({
        text: "Here are all the products:\n" + productList,
      });
    }

    // ===============================
    // 2. Nếu user gõ "new products"
    // ===============================
    if (query.includes("new products")) {
      const newProducts = await getProductsByNewArrivals();
      if (!newProducts.length) {
        return NextResponse.json({
          text: "No new products found.",
        });
      }
      const productList = newProducts
        .map((p: any) => `${p.name} - ${p.price}`)
        .join("\n");
      return NextResponse.json({
        text: "Here are the latest new products:\n" + productList,
      });
    }

    // ===============================
    // 3. Nếu user gõ "hot products"
    // ===============================
    if (query.includes("hot products")) {
      const hotProducts = await getProductsByFeatured();
      if (!hotProducts.length) {
        return NextResponse.json({
          text: "No hot products found.",
        });
      }
      const productList = hotProducts
        .map((p: any) => `${p.name} - ${p.price}`)
        .join("\n");
      return NextResponse.json({
        text: "Here are the hot products:\n" + productList,
      });
    }

    // ===============================
    // 4. Tìm sản phẩm theo tên
    // ===============================
    const found = products.find((p: any) =>
      p.name.toLowerCase().includes(query)
    );

    if (found) {
      return NextResponse.json({
        text: `I found this product:\n${found.name} - ${found.price}`,
      });
    }

    // ===============================
    // 5. Không tìm thấy
    // ===============================
    return NextResponse.json({
      text: "Sorry, I couldn't find a matching product.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
