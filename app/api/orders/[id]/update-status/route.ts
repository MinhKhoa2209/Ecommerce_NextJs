import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function PATCH(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const id = pathname.split("/")[3]; 

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Missing status field" },
        { status: 400 }
      );
    }

    const updatedOrder = await backendClient
      .patch(id)
      .set({ status })
      .commit();

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order", details: String(error) },
      { status: 500 }
    );
  }
}
