import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { setPendingPrompt } from "@/lib/pendingPromptStore";
import { buildCheckoutUrl } from "@/lib/checkout";
import { clientKey, rateLimit } from "@/lib/rateLimit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_PROMPT_LENGTH = 60_000;

/**
 * Creates the order that the checkout redirect will refer back to, then returns
 * the hosted-checkout URL for the browser to navigate to.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, "checkout"), {
    limit: 12,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { prompt, email, fullName, brandName } = body as {
      prompt?: string;
      email?: string;
      fullName?: string;
      brandName?: string;
    };

    const trimmedPrompt = typeof prompt === "string" ? prompt.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";

    if (!trimmedPrompt) {
      return NextResponse.json(
        { error: "Generate your prompt before continuing." },
        { status: 400 }
      );
    }
    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: "Prompt is too large." }, { status: 413 });
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const order = await createOrder({
      prompt: trimmedPrompt,
      email: trimmedEmail,
      fullName: typeof fullName === "string" ? fullName : undefined,
      brandName: typeof brandName === "string" ? brandName : undefined,
    });

    // Compatibility: checkout links that cannot carry metadata come back with
    // an email only, and this keyed copy is what that path looks up.
    try {
      await setPendingPrompt(
        trimmedEmail,
        trimmedPrompt,
        typeof fullName === "string" ? fullName : undefined,
        typeof brandName === "string" ? brandName : undefined
      );
    } catch (err) {
      console.error("[checkout/session] Pending prompt mirror failed:", err);
    }

    return NextResponse.json({
      ok: true,
      orderId: order.orderId,
      checkoutUrl: buildCheckoutUrl({
        orderId: order.orderId,
        email: trimmedEmail,
        fullName: typeof fullName === "string" ? fullName.trim() : undefined,
      }),
    });
  } catch (err) {
    console.error("[checkout/session] Failed:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
