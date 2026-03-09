# User model (MongoDB / Mongoose)

The `User` schema is defined in `User.ts`. Use it in **API routes or server-side code** only (e.g. Next.js API routes, server actions, or a separate backend).

## Setup

1. **Install Mongoose** (in this repo or your backend):
   ```bash
   npm install mongoose
   ```

2. **Environment**: set `MONGODB_URI` in `.env` (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/your-db`).

3. **Connect before using the model** (e.g. in each API route or in a shared db module):
   ```ts
   import mongoose from "mongoose";
   await mongoose.connect(process.env.MONGODB_URI!);
   import { User } from "@/models/User";
   ```

## User schema summary

| Field | Type | Description |
|-------|------|-------------|
| `fullName` | string | User's full name |
| `email` | string | Unique, lowercase |
| `passwordHash` | string | Optional; omit if OAuth-only |
| `payment.plan` | `"free" \| "pro" \| "enterprise"` | Plan tier |
| `payment.paymentDate` | Date \| null | Last payment / subscription start |
| `payment.isPaid` | boolean | Current period paid |
| `payment.nextBillingDate` | Date | Optional; for subscriptions |
| `payment.stripeCustomerId` | string | Optional; Stripe customer ID |
| `payment.subscriptionId` | string | Optional; for cancel/update |
| `emailVerified` | boolean | Email verification status |
| `lastLoginAt` | Date | Last login timestamp |
| `provider` / `providerId` | string | Optional; OAuth provider |
| `isActive` | boolean | Account enabled/disabled |
| `createdAt` / `updatedAt` | Date | Set automatically (timestamps) |

Frontend types for auth/session and API responses live in `src/lib/types.ts` (`User`, `UserPayment`, `PaymentPlan`).
