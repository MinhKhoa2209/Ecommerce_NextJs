import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, publicMetadata } = await req.json();

    if (!userId || !publicMetadata) {
      return NextResponse.json({ error: "Missing userId or publicMetadata" }, { status: 400 });
    }

    const client = await clerkClient();

    await client.users.updateUser(userId, {
      publicMetadata,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update metadata:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to update metadata", details: message },
      { status: 500 }
    );
  }
}
