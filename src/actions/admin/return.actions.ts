"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guards";
import { updateReturnSchema, type UpdateReturnInput } from "@/features/admin/schemas/return.schema";
import type { ActionResult } from "@/actions/account.actions";

export async function getReturnsAdmin() {
  await requireAdmin();
  return prisma.returnRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: { select: { orderNumber: true } },
      orderItem: { select: { productName: true } },
      user: { select: { name: true, email: true } },
    },
  });
}

export async function updateReturnRequest(
  id: string,
  input: UpdateReturnInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateReturnSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Données invalides." };
  }

  await prisma.returnRequest.update({
    where: { id },
    data: {
      status: parsed.data.status,
      refundAmount: parsed.data.refundAmount ?? null,
    },
  });

  revalidatePath("/admin/retours");
  return { ok: true };
}
