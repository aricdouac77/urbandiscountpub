import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  email: z.email("Adresse e-mail invalide"),
  subject: z.string().trim().min(3, "Sujet requis"),
  message: z.string().trim().min(10, "Votre message doit contenir au moins 10 caractères"),
});

export type ContactInput = z.infer<typeof contactSchema>;
