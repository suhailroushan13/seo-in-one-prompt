import { NextRequest, NextResponse } from "next/server";
import { setPendingPrompt } from "@/lib/pendingPromptStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, email, fullName, name } = body as {
      prompt?: string;
      email?: string;
      fullName?: string;
      name?: string;
    };
    const nameForSchema = (fullName ?? name) && String(fullName ?? name).trim();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid prompt" },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid email" },
        { status: 400 }
      );
    }

    await setPendingPrompt(email.trim(), prompt.trim(), nameForSchema || undefined);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
