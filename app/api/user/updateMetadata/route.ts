import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, publicMetadata } = await req.json();

    if (!userId || !publicMetadata) {
      return NextResponse.json({ error: "Missing userId or publicMetadata" }, { status: 400 });
    }

    const client = await clerkClient();

    // Ép kiểu any để tránh lỗi TS (nếu có)
    await client.users.updateUser(userId, {
      publicMetadata,
    } as any);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Failed to update metadata:", err);

    // Hiển thị lỗi chi tiết trong response để debug
    return NextResponse.json(
      { error: "Failed to update metadata", details: err.message || err.toString() },
      { status: 500 }
    );
  }
}
