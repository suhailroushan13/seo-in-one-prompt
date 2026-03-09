import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI ?? process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = globalThis.mongooseCache ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") globalThis.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGO_URI) throw new Error("Missing MONGO_URI or MONGODB_URI in .env");
  if (cached.conn) return cached.conn;
  if (cached.promise) return cached.promise;
  cached.promise = mongoose.connect(MONGO_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}
