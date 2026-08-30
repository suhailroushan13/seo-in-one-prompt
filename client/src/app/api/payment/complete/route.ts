import { NextRequest, NextResponse } from "next/server";
import { completePayment, markOrderFailed, toDeliveryPayload } from "@/lib/orders";
import { isPaidStatus } from "@/lib/checkout";
import { clientKey, rateLimit } from "@/lib/rateLimit";

/**
 * Called by the payment-result page after the provider redirects back.
 * Idempotent: repeat calls for the same order return the recorded result
 * without re-sending the delivery email.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, "complete"), {
    limit: 20,
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
    const {
      orderId,
      email,
      status,
      payment_id: paymentId,
      amount,
      currency,
      name,
      reason,
      prompt,
      brandName,
    } = body as {
      orderId?: string;
      email?: string;
      status?: string;
      payment_id?: string;
      amount?: number | string;
      currency?: string;
      name?: string;
      reason?: string;
      prompt?: string;
      brandName?: string;
    };

    if (!isPaidStatus(status)) {
      if (orderId?.trim()) await markOrderFailed(orderId, reason);
      return NextResponse.json(
        { ok: false, status: "failed", reason: reason ?? "payment_failed" },
        { status: 200 }
      );
    }

    const numericAmount =
      amount == null
        ? undefined
        : typeof amount === "number"
          ? amount
          : Number.parseFloat(String(amount));
    if (
      numericAmount !== undefined &&
      (!Number.isFinite(numericAmount) || numericAmount < 0)
    ) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const result = await completePayment({
      orderId: orderId?.trim(),
      email: email?.trim(),
      paymentId: paymentId?.trim(),
      amount: numericAmount,
      currency: currency?.trim(),
      name: name?.trim(),
      fallbackPrompt: typeof prompt === "string" ? prompt : undefined,
      fallbackBrandName: typeof brandName === "string" ? brandName : undefined,
    });

    if (!result.ok || !result.order) {
      return NextResponse.json(
        {
          ok: false,
          status: "paid",
          reason: result.reason ?? "order_not_found",
          error:
            "We could not match this payment to an order. Contact support with your payment ID and we will send your prompt.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      alreadyProcessed: result.alreadyProcessed,
      emailSent: result.emailSent,
      emailError: result.emailError,
      order: toDeliveryPayload(result.order),
    });
  } catch (err) {
    console.error("[payment/complete] Failed:", err);
    return NextResponse.json(
      { error: "Could not finalise your order. Please contact support." },
      { status: 500 }
    );
  }
}
