import { prisma } from "@/lib/prisma";

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      shippingAddress: true,
      payment: true,
    },
  });
}

export async function getOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getOrderForUser(orderNumber: string, userId: string) {
  return prisma.order.findFirst({
    where: { orderNumber, userId },
    include: {
      items: true,
      shippingAddress: true,
      billingAddress: true,
      payment: true,
      shipment: true,
    },
  });
}

export async function trackOrderByNumberAndEmail(orderNumber: string, email: string) {
  return prisma.order.findFirst({
    where: {
      orderNumber,
      customerEmail: { equals: email, mode: "insensitive" },
    },
    include: {
      items: true,
      shipment: true,
      shippingAddress: true,
    },
  });
}
