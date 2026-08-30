import { randomBytes } from "crypto";
import { connectDB } from "./db";
import { Order, type IOrderDocument } from "@/models/Order";
import { PaymentRecord } from "@/models/PaymentRecord";
import { getAndDeletePendingPrompt } from "./pendingPromptStore";
import { sendPromptEmail } from "./sendPromptEmail";
import type { DeliveryPayload } from "./deliveryPayload";
import { promptFilename } from "./delivery";

export interface CreateOrderInput {
  prompt: string;
  email: string;
  fullName?: string;
  brandName?: string;
}

export function newOrderId(): string {
  return `ord_${randomBytes(12).toString("hex")}`;
}

export async function createOrder(
  input: CreateOrderInput
): Promise<IOrderDocument> {
  await connectDB();
  return Order.create({
    orderId: newOrderId(),
    email: input.email.trim().toLowerCase(),
    name: input.fullName?.trim() || undefined,
    brandName: input.brandName?.trim() || undefined,
    prompt: input.prompt.trim(),
    status: "pending",
  });
}

export async function findOrderById(
  orderId: string
): Promise<IOrderDocument | null> {
  await connectDB();
  return Order.findOne({ orderId: orderId.trim() });
}

/**
 * Resolves the order a payment belongs to.
 *
 * Preference order: explicit order id → provider payment id (already recorded)
 * → the customer's most recent pending order. The last branch keeps checkout
 * links that cannot carry metadata working.
 */
export async function resolveOrder({
  orderId,
  paymentId,
  email,
}: {
  orderId?: string;
  paymentId?: string;
  email?: string;
}): Promise<IOrderDocument | null> {
  await connectDB();

  if (orderId?.trim()) {
    const byId = await Order.findOne({ orderId: orderId.trim() });
    if (byId) return byId;
  }
  if (paymentId?.trim()) {
    const byPayment = await Order.findOne({ paymentId: paymentId.trim() });
    if (byPayment) return byPayment;
  }
  if (email?.trim()) {
    return Order.findOne({
      email: email.trim().toLowerCase(),
      status: "pending",
    }).sort({ createdAt: -1 });
  }
  return null;
}

export interface CompletePaymentInput {
  orderId?: string;
  email?: string;
  paymentId?: string;
  amount?: number;
  currency?: string;
  name?: string;
  /** Client-held copy, used only when no server-side order exists. */
  fallbackPrompt?: string;
  fallbackBrandName?: string;
}

export interface CompletePaymentResult {
  ok: boolean;
  order?: IOrderDocument;
  emailSent: boolean;
  emailError?: string;
  alreadyProcessed: boolean;
  reason?: string;
}

/**
 * Marks an order paid, writes the payment ledger entry, and emails the PDF.
 * Safe to call more than once for the same order: delivery happens once.
 */
export async function completePayment(
  input: CompletePaymentInput
): Promise<CompletePaymentResult> {
  await connectDB();

  let order = await resolveOrder({
    orderId: input.orderId,
    paymentId: input.paymentId,
    email: input.email,
  });

  // Legacy path: prompts stored by the pre-order checkout, keyed by email only.
  if (!order && input.email?.trim()) {
    const pending = await getAndDeletePendingPrompt(input.email);
    const prompt = pending?.prompt?.trim() || input.fallbackPrompt?.trim();
    if (prompt) {
      order = await Order.create({
        orderId: newOrderId(),
        email: input.email.trim().toLowerCase(),
        name: pending?.name || input.name?.trim() || undefined,
        brandName:
          pending?.brandName || input.fallbackBrandName?.trim() || undefined,
        prompt,
        status: "pending",
      });
    }
  }

  if (!order) {
    return {
      ok: false,
      emailSent: false,
      alreadyProcessed: false,
      reason: "order_not_found",
    };
  }

  if (order.status === "paid" && order.emailSent) {
    return { ok: true, order, emailSent: true, alreadyProcessed: true };
  }

  const wasPaid = order.status === "paid";
  order.status = "paid";
  order.paidAt = order.paidAt ?? new Date();
  if (input.paymentId?.trim()) order.paymentId = input.paymentId.trim();
  if (input.name?.trim() && !order.name) order.name = input.name.trim();
  if (typeof input.amount === "number" && Number.isFinite(input.amount)) {
    order.amount = input.amount;
  }
  if (input.currency?.trim()) order.currency = input.currency.trim();
  await order.save();

  // Ledger entry — one row per payment, ignoring duplicate payment ids.
  if (!wasPaid) {
    try {
      await PaymentRecord.create({
        name: order.name,
        email: order.email,
        paymentTime: order.paidAt,
        amount: order.amount,
        currency: order.currency,
        paymentId: order.paymentId,
        prompt: order.prompt,
      });
    } catch (err: unknown) {
      const isDuplicate =
        !!err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code?: number }).code === 11000;
      if (!isDuplicate) {
        console.error("[orders] Failed to write payment record:", err);
      }
    }
  }

  const delivery = await deliverOrder(order);
  return {
    ok: true,
    order,
    emailSent: delivery.sent,
    emailError: delivery.error,
    alreadyProcessed: false,
  };
}

/** Sends (or re-sends) the delivery email for a paid order. */
export async function deliverOrder(
  order: IOrderDocument,
  { force = false }: { force?: boolean } = {}
): Promise<{ sent: boolean; error?: string }> {
  if (order.status !== "paid") {
    return { sent: false, error: "order_not_paid" };
  }
  if (order.emailSent && !force) {
    return { sent: true };
  }

  try {
    await sendPromptEmail({
      to: order.email,
      prompt: order.prompt,
      name: order.name,
      brandName: order.brandName,
      orderId: order.orderId,
    });
    order.emailSent = true;
    order.emailSentAt = new Date();
    order.emailError = undefined;
    await order.save();
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    order.emailSent = false;
    order.emailError = message;
    await order.save();
    console.error("[orders] Delivery email failed:", message);
    return { sent: false, error: message };
  }
}

export async function markOrderFailed(
  orderId: string,
  reason?: string
): Promise<void> {
  await connectDB();
  await Order.updateOne(
    { orderId: orderId.trim(), status: "pending" },
    { $set: { status: "failed", failureReason: reason?.trim() || undefined } }
  );
}

/** Shape returned to the delivery page — never includes internal fields. */
export function toDeliveryPayload(order: IOrderDocument): DeliveryPayload {
  return {
    orderId: order.orderId,
    status: order.status,
    email: order.email,
    name: order.name ?? null,
    brandName: order.brandName ?? null,
    prompt: order.status === "paid" ? order.prompt : null,
    amount: order.amount ?? null,
    currency: order.currency,
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    emailSent: order.emailSent,
    filenames: {
      pdf: promptFilename(order.brandName, "pdf"),
      md: promptFilename(order.brandName, "md"),
      txt: promptFilename(order.brandName, "txt"),
    },
  };
}
