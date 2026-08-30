import { NextRequest, NextResponse } from "next/server";
import { deliverOrder, findOrderById } from "@/lib/orders";
import { clientKey, rateLimit } from "@/lib/rateLimit";

/** Re-sends the delivery email for a paid order. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const limit = rateLimit(clientKey(request, "order-resend"), {
    limit: 4,
    windowMs: 10 * 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many resend attempts. Try again in ${Math.ceil(
          limit.retryAfterSeconds / 60
        )} minute(s).`,
      },
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
    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "This order has not been paid." },
        { status: 409 }
      );
    }

    const result = await deliverOrder(order, { force: true });
    if (!result.sent) {
      return NextResponse.json(
        { ok: false, error: "Could not send the email. Please try again shortly." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, email: order.email });
  } catch (err) {
    console.error("[order/resend] Failed:", err);
    return NextResponse.json({ error: "Resend failed" }, { status: 500 });
  }
}
