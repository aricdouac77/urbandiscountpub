"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guards";
import {
  orderStatusSchema,
  shipmentSchema,
  type OrderStatusInput,
  type ShipmentInput,
} from "@/features/admin/schemas/order.schema";
import type { ActionResult } from "@/actions/account.actions";
import type { OrderStatus } from "@/generated/prisma/client";
import { invalidateAdminStats } from "@/features/admin/queries/get-admin-stats";

const PAGE_SIZE = 20;

export async function getOrdersAdmin(page = 1, status?: OrderStatus) {
  await requireAdmin();

  const where = status ? { status } : {};

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    page,
  };
}

export async function getOrderAdminDetail(id: string) {
  await requireAdmin();

  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true,
      payment: true,
      shipment: true,
      user: { select: { id: true, name: true, email: true } },
      coupon: { select: { code: true } },
    },
  });
}

export async function updateOrderStatus(
  id: string,
  input: OrderStatusInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Statut invalide." };
  }

  await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
  await invalidateAdminStats();

  revalidatePath(`/admin/commandes/${id}`);
  revalidatePath("/admin/commandes");
  return { ok: true };
}

export async function upsertShipment(orderId: string, input: ShipmentInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = shipmentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Données d'expédition invalides." };
  }

  await prisma.shipment.upsert({
    where: { orderId },
    update: {
      carrier: parsed.data.carrier || null,
      trackingNumber: parsed.data.trackingNumber || null,
      trackingUrl: parsed.data.trackingUrl || null,
      status: parsed.data.status,
      shippedAt: parsed.data.status === "SHIPPED" ? new Date() : undefined,
      deliveredAt: parsed.data.status === "DELIVERED" ? new Date() : undefined,
    },
    create: {
      orderId,
      carrier: parsed.data.carrier || null,
      trackingNumber: parsed.data.trackingNumber || null,
      trackingUrl: parsed.data.trackingUrl || null,
      status: parsed.data.status,
    },
  });

  if (parsed.data.status === "SHIPPED") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "SHIPPED" } });
  } else if (parsed.data.status === "DELIVERED") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "DELIVERED" } });
  }
  await invalidateAdminStats();

  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath("/admin/commandes");
  return { ok: true };
}
