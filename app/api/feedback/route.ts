import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: Request) {
  const { orderId, productId, rating, comment, images } = await req.json();

  try {
await backendClient
  .patch(orderId)
  .set({
    [`products[_key=="${productId}"].review`]: {
      rating,
      comment,
      images,
      reviewDate: new Date().toISOString(),
    },
  })
  .commit();


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving review:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
