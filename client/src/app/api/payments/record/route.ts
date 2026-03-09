import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { PaymentRecord } from "@/models/PaymentRecord";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name,
      email,
      payment_id,
      amount,
      currency,
      prompt,
    } = body as {
      name?: string;
      email?: string;
      payment_id?: string;
      amount?: number | string;
      currency?: string;
      prompt?: string;
    };

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid email" },
        { status: 400 }
      );
    }

    const numAmount =
      amount != null
        ? typeof amount === "number"
          ? amount
          : parseFloat(String(amount))
        : undefined;
    const isValidAmount =
      numAmount == null || (Number.isFinite(numAmount) && numAmount >= 0);

    if (!isValidAmount) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    await connectDB();

    await PaymentRecord.create({
      name: name && String(name).trim() ? String(name).trim() : undefined,
      email: email.trim(),
      paymentTime: new Date(),
      amount: numAmount,
      currency: currency && String(currency).trim() ? String(currency).trim() : "USD",
      paymentId: payment_id && String(payment_id).trim() ? String(payment_id).trim() : undefined,
      prompt: prompt && String(prompt).trim() ? String(prompt).trim() : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Record payment error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record payment" },
      { status: 500 }
    );
  }
}
