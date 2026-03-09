# Dodo Payments — Single redirect URL

**Domain:** `https://seopromptai.com/`

You can configure **only one redirect URL** in Dodo. Use the URL below for both success and failure; the page shows the right message based on the `status` query parameter.

---

## The one URL to add in Dodo

**Redirect URL:**

```
https://seopromptai.com/payment/result
```

Always send users to this URL. Append query parameters so the page knows whether payment succeeded or failed.

---

## Query parameters (append to the URL)

Use **`status`** to choose success vs failure. Add other params as needed.

### When payment succeeds

Redirect to:

```
https://seopromptai.com/payment/result?status=success
```

Optional params (all are saved to the database and shown on the success page):

| Param         | Example            | Description |
|---------------|--------------------|-------------|
| `email`       | `user@example.com` | Customer email; required for saving the payment. |
| `name`        | `John Doe`         | Customer name; shown and stored. |
| `payment_id`  | `pay_xxx`          | Payment ID from Dodo; stored for reference. |
| `amount`      | `9.99`             | Payment amount; shown and stored (e.g. for receipt). |
| `currency`    | `USD`              | Currency code (default: USD). |

**Example:**

```
https://seopromptai.com/payment/result?status=success&email=user@example.com&payment_id=pay_xxx&name=John&amount=9.99
```

---

### When payment fails or user cancels

Redirect to:

```
https://seopromptai.com/payment/result?status=failure
```

Optional param:

| Param    | Example       | Description |
|----------|---------------|-------------|
| `reason` | `cancelled`    | Use `cancelled`, `payment_failed`, `declined`, or `expired`. |
| `error`  | `card_declined`| Alternative to `reason` if Dodo sends an error code. |

**Examples:**

- User cancelled:  
  `https://seopromptai.com/payment/result?status=failure&reason=cancelled`
- Payment failed:  
  `https://seopromptai.com/payment/result?status=failure&reason=payment_failed`

---

## What to set in Dodo

| Setting in Dodo | Value |
|-----------------|--------|
| **Redirect URL** | `https://seopromptai.com/payment/result` |

Then, when redirecting after checkout:

- **Success:** redirect to  
  `https://seopromptai.com/payment/result?status=success&email={customer_email}`  
  (add `&session_id=...` if you have it)
- **Failure / Cancel:** redirect to  
  `https://seopromptai.com/payment/result?status=failure&reason=cancelled`  
  or  
  `https://seopromptai.com/payment/result?status=failure&reason=payment_failed`

If Dodo only lets you set one static URL (no query params), set it to  
`https://seopromptai.com/payment/result`.  
The page will treat a missing `status` as failure and show “Payment unsuccessful”. For success, Dodo would need to redirect with at least `?status=success` (and ideally `email=...`).

---

## What the user sees

- **Success** (`status=success`): “Check your email — we’ve sent you the prompt” and, if provided, “Sent to **email**”.
- **Failure** (`status=failure` or no `status`): “Payment unsuccessful” plus a reason (cancelled, failed, declined, expired).
