import { NextResponse } from "next/server";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import { getProductsByNewArrivals } from "@/sanity/lib/products/getProductsByNewArrivals";
import { getProductsByFeatured } from "@/sanity/lib/products/getProductsByFeatured";
import { Product } from "@/sanity.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const lastMsg: string = messages[messages.length - 1]?.content || "";
    const query = lastMsg.toLowerCase().trim();
    const products: Product[] = await getAllProducts();
    const formatPriceUSD = (price?: number) =>
      price ? `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "N/A";

    const formatProduct = (p: Product) =>
      `${p.name ?? "Unnamed"} - ${formatPriceUSD(p.price)}`;

    const keywords = ["all products", "new products", "hot products", "product name"];

    if (
      query === "" ||
      query.includes("help") ||
      query.includes("suggest") ||
      query.includes("hint") ||
      query.includes("what can you do") ||
      query.includes("gợi ý") ||
      query.includes("tư vấn") ||
      query.includes("hướng dẫn")
    ) {
      return NextResponse.json({
        text:
          "I can help you find products.\nHere are some suggestions:\n" +
          keywords.map((k) => `• ${k}`).join("\n"),
      });
    }

    if (query.includes("all products")) {
      const productList = products.map(formatProduct).join("\n");
      return NextResponse.json({
        text: "Here are all the products:\n" + productList,
      });
    }

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

    const found = products.find(
      (p) => p.name && p.name.toLowerCase().includes(query)
    );

    if (found) {
      return NextResponse.json({
        text: `I found this product:\n${formatProduct(found)}`,
      });
    }

    return NextResponse.json({
      text:
        "Sorry, I couldn't find a matching product.\nTry one of these:\n" +
        keywords.map((k) => `• ${k}`).join("\n"),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
