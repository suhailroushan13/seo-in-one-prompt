# Dodo Payments — checkout, redirect, and webhook setup

How money turns into a delivered prompt, and what to configure in the Dodo
dashboard so it works end to end.

---

## The flow

1. **Order created.** `POST /api/checkout/session` stores the generated prompt
   with the buyer's email and returns an unguessable order id (`ord_<hex>`).
2. **Redirect to checkout.** The browser navigates to the hosted checkout URL
   built by `src/lib/checkout.ts`:

   ```
   https://dodo.pe/seopromptai
     ?redirect_url=https%3A%2F%2Fseopromptai.com%2Fpayment%2Fresult%3Forder%3Dord_xxx
     &metadata_orderId=ord_xxx
     &email=buyer%40example.com
     &fullName=Jane%20Doe
   ```

   `metadata_orderId` is what the webhook reads. `redirect_url` is what the
   browser comes back to.
3. **Webhook confirms (authoritative).** Dodo calls
   `POST /api/payment/webhook`. The order is marked paid and the email with the
   PDF + Markdown attachments is sent. This path runs even if the buyer closes
   the tab.
4. **Redirect lands (cosmetic).** The buyer arrives at `/payment/result`, which
   reads the order by id, polls briefly for the webhook, and — if the webhook
   has not arrived — completes the order itself via
   `POST /api/payment/complete`. Completion is idempotent, so both paths racing
   is safe.
5. **Permanent link.** The result page shows `/delivery/<orderId>`, which
   re-renders the prompt and can re-send the email at any time.

---

## What to set in the Dodo dashboard

| Setting | Value |
|---|---|
| **Return / redirect URL** | `https://seopromptai.com/payment/result` |
| **Webhook URL** | `https://seopromptai.com/api/payment/webhook` |
| **Webhook signing secret** | copy into `DODO_WEBHOOK_SECRET` |

The app appends `redirect_url` and `metadata_orderId` per checkout, so a static
redirect URL in the dashboard is only the fallback.

### Webhook secret is required

`/api/payment/webhook` returns **503** when `DODO_WEBHOOK_SECRET` is unset and
**401** on a bad signature. Signatures follow the Standard Webhooks scheme:
`HMAC-SHA256` over `{webhook-id}.{webhook-timestamp}.{raw body}`, with a 5-minute
timestamp tolerance. Never disable this check — the endpoint delivers paid goods.

### Webhook events consumed

| Event type matches | Effect |
|---|---|
| `succeeded`, `completed`, `paid` | Order marked paid, prompt emailed |
| `failed`, `cancelled`, `canceled`, `expired` | Order marked failed (needs `metadata.orderId`) |

Expected payload shape:

```json
{
  "type": "payment.succeeded",
  "data": {
    "payment_id": "pay_xxx",
    "total_amount": 900,
    "currency": "USD",
    "customer": { "email": "buyer@example.com", "name": "Jane Doe" },
    "metadata": { "orderId": "ord_xxx" }
  }
}
```

`total_amount` is read in minor units (900 → 9.00).

---

## Redirect query parameters

`/payment/result` accepts these; all are optional because the order id alone is
enough to resolve state.

| Param | Example | Purpose |
|---|---|---|
| `order` | `ord_9f2c…` | Our order id. Best signal — set automatically via `redirect_url`. |
| `status` | `success` / `succeeded` / `paid` / `failure` | Provider outcome. Anything not in the paid set is treated as failed. |
| `payment_id` | `pay_xxx` | Used to complete the order when `order` is missing. |
| `email` | `buyer@example.com` | Last-resort lookup key. |
| `reason` | `cancelled`, `payment_failed`, `declined`, `expired` | Shown on the failure view. |

A missing `status` is **not** treated as failure. The page resolves the real
state from the order record instead.

---

## Legacy landing paths

`/success` and `/failure` still exist for checkout links configured before this
flow. Both are server redirects that forward every query parameter to
`/payment/result` (see `src/lib/resultRedirect.ts`), so old links keep working.
The same is true of a redirect to the home page carrying payment params —
`PaymentRedirectHandler` forwards those on the client.

---

## Testing

```bash
# Fails with 503 until DODO_WEBHOOK_SECRET is set, 401 without a valid signature.
curl -i -X POST http://localhost:3000/api/payment/webhook \
  -H 'content-type: application/json' -d '{"type":"payment.succeeded"}'

# Resolve an order the way the result page does.
curl -s http://localhost:3000/api/order/ord_xxx | jq
```

---

## What the buyer sees

- **Paid:** the full prompt on screen, section by section, with PDF / Markdown /
  plain-text downloads, a copy button per section, a permanent
  `/delivery/<orderId>` link, and the same files emailed as attachments.
- **Pending:** a "payment is confirming" state that keeps polling; the email
  arrives regardless once the webhook lands.
- **Failed:** the reason, plus a retry link back to checkout.
