"use server";

import { z } from "zod";
import { trackOrderByNumberAndEmail } from "@/features/orders/queries/get-order";

const trackOrderSchema = z.object({
  orderNumber: z.string().trim().min(3),
  email: z.email(),
});

export type TrackOrderResult =
  | {
      ok: true;
      order: NonNullable<Awaited<ReturnType<typeof trackOrderByNumberAndEmail>>>;
    }
  | { ok: false; message: string };

export async function trackOrder(orderNumber: string, email: string): Promise<TrackOrderResult> {
  const parsed = trackOrderSchema.safeParse({ orderNumber, email });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Merci de renseigner un numéro de commande et un e-mail valides.",
    };
  }

  const order = await trackOrderByNumberAndEmail(parsed.data.orderNumber, parsed.data.email);

  if (!order) {
    return {
      ok: false,
      message: "Aucune commande trouvée avec ces informations. Vérifiez le numéro et l'e-mail.",
    };
  }

  return { ok: true, order };
}
