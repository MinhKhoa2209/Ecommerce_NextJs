import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: Request) {
  const { orderId, productKey, rating, comment, images } = await req.json();


  try {
    const result = await backendClient
      .patch(orderId)
      .set({
        [`products[_key=="${productKey}"].review`]: {
          rating,
          comment,
          images,
          reviewDate: new Date().toISOString(),
        },
      })
      .commit();


    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("❌ Error saving review:", error.message || error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
