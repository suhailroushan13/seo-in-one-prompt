# Analytics and view counter

## Vercel Analytics

To enable Vercel Analytics:

1. Install: `npm install @vercel/analytics --legacy-peer-deps`
2. In `src/components/Analytics.tsx`, replace the placeholder with:

```tsx
"use client";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
export function Analytics() {
  return <VercelAnalytics />;
}
```

## Total views counter

The footer shows "Total views" from the `/api/views` endpoint. By default it returns `0`.

To persist the count (e.g. on Vercel):

1. Create a Vercel KV store in the Vercel dashboard and connect it to this project.
2. Install: `npm install @vercel/kv --legacy-peer-deps`
3. In `src/app/api/views/route.ts`, replace the GET/POST bodies with:

```ts
const { kv } = await import("@vercel/kv");
// GET: const views = (await kv.get<number>("seo-prompt-total-views")) ?? 0;
// POST: const views = await kv.incr("seo-prompt-total-views");
```
