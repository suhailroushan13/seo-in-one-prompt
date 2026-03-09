import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaymentRecord {
  name?: string;
  email: string;
  paymentTime: Date;
  amount?: number;
  currency?: string;
  paymentId?: string;
}

export interface IPaymentRecordDocument extends IPaymentRecord, Document {
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IPaymentRecordDocument>(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    paymentTime: { type: Date, required: true, default: () => new Date() },
    amount: { type: Number },
    currency: { type: String, default: "USD" },
    paymentId: { type: String, trim: true },
  },
  { timestamps: true }
);

schema.index({ email: 1, paymentTime: -1 });
schema.index({ paymentId: 1 }, { unique: true, sparse: true });

export const PaymentRecord: Model<IPaymentRecordDocument> =
  (mongoose.models?.PaymentRecord as Model<IPaymentRecordDocument>) ??
  mongoose.model<IPaymentRecordDocument>("PaymentRecord", schema);
