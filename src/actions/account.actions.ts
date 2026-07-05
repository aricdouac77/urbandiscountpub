"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guards";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/features/account/schemas/account.schema";

export type ActionResult = { ok: true } | { ok: false; message: string };

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const session = await requireUser();
  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Données invalides." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
  });

  revalidatePath("/compte");
  revalidatePath("/compte/profil");

  return { ok: true };
}
