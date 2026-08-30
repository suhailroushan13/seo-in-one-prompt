import { NextRequest, NextResponse } from "next/server";
import { findOrderById, toDeliveryPayload } from "@/lib/orders";
import { clientKey, rateLimit } from "@/lib/rateLimit";

/**
 * Delivery lookup. The order id is unguessable (96 bits of entropy) and acts as
 * the bearer token for the receipt, so the link works on any device.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const limit = rateLimit(clientKey(request, "order-read"), {
    limit: 60,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const { orderId } = await params;
    if (!/^ord_[a-f0-9]{16,64}$/.test(orderId ?? "")) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = await findOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { ok: true, order: toDeliveryPayload(order) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[order] Lookup failed:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
