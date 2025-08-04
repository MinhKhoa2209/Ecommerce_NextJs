import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { client } from "@/sanity/lib/client";
import { redirect } from "next/navigation";
import { draftMode } from "next/headers";

export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN;

  // Validate preview URL
  const { isValid, redirectTo = "/" } = await validatePreviewUrl(client.withConfig({ token }), request.url);

  if (!isValid) {
    return new Response("Invalid secret", { status: 401 });
  }

  // Enable draft mode
  (await draftMode()).enable();

  redirect(redirectTo);
}
