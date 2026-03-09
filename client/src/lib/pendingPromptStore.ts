/**
 * MongoDB-backed store for prompts pending payment.
 * Keyed by email so when Dodo redirects with ?status=success&email=... we can look up and send.
 * TTL 1 hour (MongoDB expireAfterSeconds); entry is removed after email is sent.
 */

import { connectDB } from "./db";
import { PendingPrompt } from "@/models/PendingPrompt";

export interface PendingPromptData {
  prompt: string;
  name?: string;
}

export async function setPendingPrompt(
  email: string,
  prompt: string,
  name?: string
): Promise<void> {
  await connectDB();
  const key = email.toLowerCase().trim();
  await PendingPrompt.findOneAndUpdate(
    { email: key },
    { $set: { email: key, prompt, name: name?.trim() || undefined, createdAt: new Date() } },
    { upsert: true, new: true }
  );
}

export async function getAndDeletePendingPrompt(
  email: string
): Promise<PendingPromptData | null> {
  await connectDB();
  const key = email.toLowerCase().trim();
  const doc = await PendingPrompt.findOneAndDelete({ email: key });
  if (!doc) return null;
  return { prompt: doc.prompt, name: doc.name };
}
