"use server";

import { contactSchema, type ContactInput } from "@/features/contact/schemas/contact.schema";
import { getResend } from "@/services/resend";
import { rateLimit } from "@/lib/rate-limit";

export type ContactResult = { ok: true } | { ok: false; message: string };

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@urbandiscount.com";

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const limited = await rateLimit("contact", { requests: 3, windowSeconds: 60 });
  if (!limited.success) {
    return { ok: false, message: limited.message };
  }

  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const resend = getResend();

  if (!resend) {
    // No email provider configured in this environment — surface that honestly
    // instead of silently pretending the message was delivered.
    return {
      ok: false,
      message:
        "L'envoi d'e-mail n'est pas configuré sur cet environnement de démonstration. Votre message n'a pas pu être transmis.",
    };
  }

  const { name, email, subject, message } = parsed.data;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "UrbanDiscount <no-reply@urbandiscount.com>",
    to: SUPPORT_EMAIL,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    text: `De : ${name} <${email}>\n\n${message}`,
  });

  return { ok: true };
}
