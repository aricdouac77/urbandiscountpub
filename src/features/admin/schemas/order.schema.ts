import { z } from "zod";

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

export const shipmentSchema = z.object({
  carrier: z.string().trim().optional().or(z.literal("")),
  trackingNumber: z.string().trim().optional().or(z.literal("")),
  trackingUrl: z.url().optional().or(z.literal("")),
  status: z.enum(["PREPARING", "SHIPPED", "IN_TRANSIT", "DELIVERED", "FAILED"]),
});

export type ShipmentInput = z.infer<typeof shipmentSchema>;
