import { NextRequest, NextResponse } from "next/server";
import { generateSeoPromptReport } from "@/lib/pdfReport";
import { findOrderById } from "@/lib/orders";
import { clientKey, rateLimit } from "@/lib/rateLimit";

/**
 * Renders the prompt PDF. Pass `orderId` for a paid order (the prompt is read
 * server-side) or a raw `prompt` for the buyer's own local copy.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, "pdf"), {
    limit: 15,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, prompt, fullName, email, brandName } = body as {
      orderId?: string;
      prompt?: string;
      fullName?: string;
      email?: string;
      brandName?: string;
    };

    let input = {
      prompt: typeof prompt === "string" ? prompt.trim() : "",
      fullName: (fullName ?? "").trim(),
      email: (email ?? "").trim(),
      brandName: (brandName ?? "").trim(),
      orderId: undefined as string | undefined,
    };

    if (orderId?.trim()) {
      const order = await findOrderById(orderId);
      if (!order || order.status !== "paid") {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      input = {
        prompt: order.prompt,
        fullName: order.name ?? "",
        email: order.email,
        brandName: order.brandName ?? "",
        orderId: order.orderId,
      };
    }

    if (!input.prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const { buffer, filename } = await generateSeoPromptReport(input);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[report/pdf] Failed:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
