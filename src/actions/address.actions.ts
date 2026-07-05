"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guards";
import { addressSchema, type AddressInput } from "@/features/account/schemas/account.schema";
import type { ActionResult } from "@/actions/account.actions";

export async function getMyAddresses() {
  const session = await requireUser();
  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(input: AddressInput): Promise<ActionResult> {
  const session = await requireUser();
  const parsed = addressSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Adresse invalide." };
  }

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName: parsed.data.fullName,
      company: parsed.data.company || null,
      line1: parsed.data.line1,
      line2: parsed.data.line2 || null,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      country: parsed.data.country,
      phone: parsed.data.phone || null,
      isDefault: parsed.data.isDefault ?? false,
    },
  });

  revalidatePath("/compte/adresses");
  return { ok: true };
}

export async function deleteAddress(addressId: string): Promise<ActionResult> {
  const session = await requireUser();

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });

  if (!address) {
    return { ok: false, message: "Adresse introuvable." };
  }

  await prisma.address.delete({ where: { id: addressId } });
  revalidatePath("/compte/adresses");
  return { ok: true };
}

export async function setDefaultAddress(addressId: string): Promise<ActionResult> {
  const session = await requireUser();

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });

  if (!address) {
    return { ok: false, message: "Adresse introuvable." };
  }

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    }),
    prisma.address.update({ where: { id: addressId }, data: { isDefault: true } }),
  ]);

  revalidatePath("/compte/adresses");
  return { ok: true };
}
