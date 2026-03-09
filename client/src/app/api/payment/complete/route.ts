import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { PaymentRecord } from "@/models/PaymentRecord";
import { getAndDeletePendingPrompt } from "@/lib/pendingPromptStore";
import { sendPromptEmail } from "@/lib/sendPromptEmail";

/**
 * Single endpoint for payment success: fetches pending prompt (with name, brandName),
 * records payment in MongoDB (including name), and sends HTML email with PDF attachment.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      email,
      status,
      payment_id,
      amount,
      currency,
      name: nameFromBody,
      fullName: fullNameFromBody,
      prompt: promptFromBody,
      brandName: brandNameFromBody,
    } = body as {
      email?: string;
      status?: string;
      payment_id?: string;
      amount?: number | string;
      currency?: string;
      name?: string;
      fullName?: string;
      prompt?: string;
      brandName?: string;
    };

    const isSuccess = /^(success|succeeded|paid|completed)$/i.test(status ?? "");
    if (!isSuccess) {
      return NextResponse.json(
        { error: "Completion is only for successful payments" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid email" },
        { status: 400 }
      );
    }

    const key = email.trim().toLowerCase();
    const paymentIdTrimmed = payment_id && String(payment_id).trim() ? String(payment_id).trim() : undefined;

    await connectDB();

    // Idempotency: if we already processed this payment (same payment_id), do not record again or send email again
    if (paymentIdTrimmed) {
      const existing = await PaymentRecord.findOne({ paymentId: paymentIdTrimmed });
      if (existing) {
        return NextResponse.json({
          ok: true,
          sent: true,
          name: existing.name ?? undefined,
        });
      }
    }

    const promptInBody = typeof promptFromBody === "string" && promptFromBody.trim().length > 0;

    // 1) Get prompt + name + brandName: from request body (localStorage) or from server pending store
    let promptToSend: string | null = null;
    let nameToUse: string | undefined;
    let brandToUse: string | undefined;
    if (promptInBody) {
      promptToSend = promptFromBody.trim();
      nameToUse = (fullNameFromBody ?? nameFromBody) && String(fullNameFromBody ?? nameFromBody).trim() || undefined;
      brandToUse = brandNameFromBody && String(brandNameFromBody).trim() || undefined;
    } else {
      const pending = await getAndDeletePendingPrompt(key);
      if (pending) {
        promptToSend = pending.prompt;
        nameToUse = pending.name || nameFromBody?.trim() || undefined;
        brandToUse = pending.brandName?.trim() || brandNameFromBody?.trim() || undefined;
      } else {
        nameToUse = nameFromBody?.trim() || undefined;
        brandToUse = brandNameFromBody?.trim() || undefined;
        console.warn(`[payment/complete] No pending prompt for email: ${key} (and no prompt in body).`);
      }
    }

    // 2) Record payment in MongoDB (with name from above)
    const numAmount =
      amount != null
        ? typeof amount === "number"
          ? amount
          : parseFloat(String(amount))
        : undefined;
    const isValidAmount =
      numAmount == null || (Number.isFinite(numAmount) && numAmount >= 0);
    if (!isValidAmount && numAmount !== undefined) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    try {
      await PaymentRecord.create({
        name: nameToUse,
        email: key,
        paymentTime: new Date(),
        amount: numAmount,
        currency: currency && String(currency).trim() ? String(currency).trim() : "USD",
        paymentId: paymentIdTrimmed,
      });
    } catch (err: unknown) {
      // Race: another request already created this payment (unique index on paymentId)
      const isDup = err && typeof err === "object" && "code" in err && (err as { code?: number }).code === 11000;
      if (isDup && paymentIdTrimmed) {
        return NextResponse.json({
          ok: true,
          sent: true,
          name: nameToUse ?? undefined,
        });
      }
      throw err;
    }

    // 3) Send HTML email with PDF attachment (if we have a prompt) — only once per payment_id (checked above)
    let sent = false;
    let sendError: string | undefined;
    if (promptToSend) {
      try {
        await sendPromptEmail(key, promptToSend, nameToUse, brandToUse);
        sent = true;
      } catch (err) {
        sendError = err instanceof Error ? err.message : "Send failed";
        console.error("[payment/complete] Email send failed:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      reason: !promptToSend ? "no_pending_prompt" : sendError ? "email_send_failed" : undefined,
      name: nameToUse ?? undefined,
    });
  } catch (err) {
    console.error("Payment complete error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to complete payment" },
      { status: 500 }
    );
  }
}
