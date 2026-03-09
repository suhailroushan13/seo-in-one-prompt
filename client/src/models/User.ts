import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Payment plan tiers for the SEO platform.
 * Extend as needed (e.g. "enterprise", "team").
 */
export type PaymentPlan = "free" | "pro" | "enterprise";

export interface IPayment {
  plan: PaymentPlan;
  /** Last successful payment / subscription start date */
  paymentDate: Date | null;
  /** Whether the current period is paid (e.g. subscription active or one-time paid) */
  isPaid: boolean;
  /** Optional: next billing date for subscriptions */
  nextBillingDate?: Date;
  /** Optional: external payment provider customer ID (e.g. Stripe) */
  stripeCustomerId?: string;
  /** Optional: current subscription ID for cancellation/updates */
  subscriptionId?: string;
}

export interface IUser {
  fullName: string;
  email: string;
  /** Hashed password; omit if using OAuth only */
  passwordHash?: string;
  payment: IPayment;
  /** Whether the user has verified their email */
  emailVerified: boolean;
  /** Last login timestamp for analytics and security */
  lastLoginAt?: Date;
  /** Optional: link to OAuth provider (e.g. "google", "github") */
  provider?: string;
  /** Optional: provider-specific user id */
  providerId?: string;
  /** Soft delete / disabled account */
  isActive: boolean;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    paymentDate: { type: Date, default: null },
    isPaid: { type: Boolean, default: false },
    nextBillingDate: { type: Date },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
  },
  { _id: false }
);

const userSchema = new Schema<IUserDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    payment: {
      type: paymentSchema,
      default: () => ({ plan: "free" as const, paymentDate: null, isPaid: false }),
    },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    provider: { type: String },
    providerId: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = (ret._id as mongoose.Types.ObjectId).toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
      },
    },
  }
);

// Indexes for common queries
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ "payment.isPaid": 1, "payment.plan": 1 });
userSchema.index({ createdAt: -1 });

export const User: Model<IUserDocument> =
  (mongoose.models?.User as Model<IUserDocument>) ??
  mongoose.model<IUserDocument>("User", userSchema);
