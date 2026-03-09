import { NextRequest, NextResponse } from "next/server";
import { getAndDeletePendingPrompt } from "@/lib/pendingPromptStore";
import { sendPromptEmail } from "@/lib/sendPromptEmail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, status } = (body || {}) as { email?: string; status?: string };

    const isSuccess = /^(success|succeeded|paid|completed)$/i.test(
      status ?? ""
    );
    if (!isSuccess) {
      return NextResponse.json(
        { error: "Email is only sent after successful payment" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid email" },
        { status: 400 }
      );
    }

    const pending = await getAndDeletePendingPrompt(email.trim());
    if (!pending) {
      return NextResponse.json(
        { error: "No prompt found for this email. It may have already been sent or expired." },
        { status: 404 }
      );
    }

    await sendPromptEmail(email.trim(), pending.prompt, pending.name);
    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    console.error("Send prompt email error:", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
