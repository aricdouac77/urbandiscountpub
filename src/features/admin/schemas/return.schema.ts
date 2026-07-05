import { z } from "zod";

export const updateReturnSchema = z.object({
  status: z.enum(["REQUESTED", "APPROVED", "REJECTED", "RECEIVED", "REFUNDED"]),
  refundAmount: z.coerce.number().min(0).optional().nullable(),
});

export type UpdateReturnFormValues = z.input<typeof updateReturnSchema>;
export type UpdateReturnInput = z.output<typeof updateReturnSchema>;
