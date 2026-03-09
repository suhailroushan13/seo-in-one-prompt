import { NextResponse } from "next/server";

/**
 * Total views counter. Returns 0 by default.
 * To enable persistent count: npm install @vercel/kv --legacy-peer-deps,
 * set up Vercel KV in the dashboard, then add:
 *   const { kv } = await import("@vercel/kv");
 *   const views = await kv.incr("seo-prompt-total-views");  // in POST
 *   const views = await kv.get("seo-prompt-total-views");   // in GET
 */
export async function GET() {
  return NextResponse.json({ views: 0 });
}

export async function POST() {
  return NextResponse.json({ views: 0 });
}
