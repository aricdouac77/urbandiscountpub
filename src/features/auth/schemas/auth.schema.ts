import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Adresse e-mail invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "2 caractères minimum").max(100),
  email: z.email("Adresse e-mail invalide"),
  password: z.string().min(8, "8 caractères minimum").max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
