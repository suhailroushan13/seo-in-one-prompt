import mongoose, { Schema, Document, Model } from "mongoose";

const TTL_SECONDS = 60 * 60; // 1 hour

export interface IPendingPrompt {
  email: string;
  prompt: string;
  name?: string;
  createdAt: Date;
}

export interface IPendingPromptDocument extends IPendingPrompt, Document {}

const schema = new Schema<IPendingPromptDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    prompt: { type: String, required: true },
    name: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

schema.index({ email: 1 }, { unique: true });
schema.index({ createdAt: 1 }, { expireAfterSeconds: TTL_SECONDS });

export const PendingPrompt: Model<IPendingPromptDocument> =
  (mongoose.models?.PendingPrompt as Model<IPendingPromptDocument>) ??
  mongoose.model<IPendingPromptDocument>("PendingPrompt", schema);
