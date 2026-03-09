import { NextRequest, NextResponse } from "next/server";
import { generateSeoPromptReport } from "@/lib/pdfReport";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { prompt, fullName, email, brandName } = body as {
      prompt?: string;
      fullName?: string;
      email?: string;
      brandName?: string;
    };

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid prompt" },
        { status: 400 }
      );
    }

    const { buffer, filename } = await generateSeoPromptReport({
      prompt: prompt.trim(),
      fullName: (fullName ?? "").trim(),
      email: (email ?? "").trim(),
      brandName: (brandName ?? "").trim(),
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("[api/report/pdf] Error generating PDF:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
