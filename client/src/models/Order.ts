import mongoose, { Schema, Document, Model } from "mongoose";

/** Orders are pruned 60 days after creation so the collection stays bounded. */
const TTL_SECONDS = 60 * 60 * 24 * 60;

export type OrderStatus = "pending" | "paid" | "failed";

export interface IOrder {
  orderId: string;
  email: string;
  name?: string;
  brandName?: string;
  prompt: string;
  status: OrderStatus;
  amount?: number;
  currency: string;
  paymentId?: string;
  paidAt?: Date;
  failureReason?: string;
  emailSent: boolean;
  emailSentAt?: Date;
  emailError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {}

const schema = new Schema<IOrderDocument>(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    brandName: { type: String, trim: true },
    prompt: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    amount: { type: Number },
    currency: { type: String, default: "USD" },
    paymentId: { type: String, trim: true },
    paidAt: { type: Date },
    failureReason: { type: String, trim: true },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
    emailError: { type: String },
  },
  { timestamps: true }
);

schema.index({ email: 1, createdAt: -1 });
schema.index({ paymentId: 1 }, { unique: true, sparse: true });
schema.index({ createdAt: 1 }, { expireAfterSeconds: TTL_SECONDS });

export const Order: Model<IOrderDocument> =
  (mongoose.models?.Order as Model<IOrderDocument>) ??
  mongoose.model<IOrderDocument>("Order", schema);
