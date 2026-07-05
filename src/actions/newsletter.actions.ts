"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const subscribeSchema = z.object({
  email: z.email(),
});

export type NewsletterActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function subscribeToNewsletter(
  _prevState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const limited = await rateLimit("newsletter", { requests: 5, windowSeconds: 60 });
  if (!limited.success) {
    return { status: "error", message: limited.message };
  }

  const parsed = subscribeSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { status: "error", message: "Adresse e-mail invalide." };
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: { isSubscribed: true, unsubscribedAt: null },
    create: { email: parsed.data.email },
  });

  return { status: "success", message: "Merci pour votre inscription !" };
}
