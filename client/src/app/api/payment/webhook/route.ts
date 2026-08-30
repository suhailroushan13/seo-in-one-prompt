import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { completePayment, markOrderFailed } from "@/lib/orders";

const TOLERANCE_SECONDS = 5 * 60;

/**
 * Verifies a Standard Webhooks signature (the scheme Dodo Payments uses).
 * A deployment without a configured secret rejects every request, so the
 * endpoint can never be spoofed into delivering an order.
 */
function verifySignature(
  rawBody: string,
  headers: Headers,
  secret: string
): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const sentAt = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(sentAt)) return false;
  if (Math.abs(Date.now() / 1000 - sentAt) > TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");
  const expectedBuffer = Buffer.from(expected);

  return signatureHeader
    .split(/\s+/)
    .map((part) => part.split(",").pop() ?? "")
    .filter(Boolean)
    .some((candidate) => {
      const candidateBuffer = Buffer.from(candidate);
      return (
        candidateBuffer.length === expectedBuffer.length &&
        timingSafeEqual(candidateBuffer, expectedBuffer)
      );
    });
}

interface WebhookPayload {
  type?: string;
  data?: {
    payment_id?: string;
    total_amount?: number;
    currency?: string;
    customer?: { email?: string; name?: string };
    metadata?: Record<string, string>;
  };
}

/**
 * Server-to-server confirmation. This is the authoritative path: it delivers
 * the prompt even when the buyer closes the tab before the redirect lands.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("[payment/webhook] DODO_WEBHOOK_SECRET is not set; rejecting.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const eventType = payload.type ?? "";
  const data = payload.data ?? {};
  const orderId = data.metadata?.orderId;

  try {
    if (/succeeded|completed|paid/i.test(eventType)) {
      // Providers report money in minor units.
      const amount =
        typeof data.total_amount === "number"
          ? data.total_amount / 100
          : undefined;

      const result = await completePayment({
        orderId,
        email: data.customer?.email,
        paymentId: data.payment_id,
        amount,
        currency: data.currency,
        name: data.customer?.name,
      });
      return NextResponse.json({
        ok: result.ok,
        emailSent: result.emailSent,
        reason: result.reason,
      });
    }

    if (/failed|cancelled|canceled|expired/i.test(eventType) && orderId) {
      await markOrderFailed(orderId, eventType);
    }
    return NextResponse.json({ ok: true, ignored: eventType });
  } catch (err) {
    console.error("[payment/webhook] Processing failed:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
