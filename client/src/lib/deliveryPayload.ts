import type { OrderStatus } from "@/models/Order";

/** The client-safe view of an order, returned by the order and payment APIs. */
export interface DeliveryPayload {
  orderId: string;
  status: OrderStatus;
  email: string;
  name: string | null;
  brandName: string | null;
  /** Present only once the order is paid. */
  prompt: string | null;
  amount: number | null;
  currency: string;
  paidAt: string | null;
  emailSent: boolean;
  filenames: { pdf: string; md: string; txt: string };
}
