"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-guards";
import { getStripe } from "@/services/stripe";
import {
  createOrderSchema,
  type CreateOrderInput,
} from "@/features/checkout/schemas/checkout.schema";
import { invalidateAdminStats } from "@/features/admin/queries/get-admin-stats";
import { rateLimit } from "@/lib/rate-limit";

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING_COST = 4.9;

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UD-${timestamp}${random}`;
}

export type CreateOrderResult =
  | { ok: true; orderId: string; orderNumber: string; clientSecret: string | null }
  | { ok: false; message: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const limited = await rateLimit("checkout", { requests: 5, windowSeconds: 60 });
  if (!limited.success) {
    return { ok: false, message: limited.message };
  }

  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Données de commande invalides." };
  }

  const { shipping, items, couponCode } = parsed.data;
  const session = await getCurrentSession();

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: items.map((i) => i.variantId) } },
    include: { product: true },
  });

  if (variants.length !== items.length) {
    return { ok: false, message: "Un ou plusieurs articles ne sont plus disponibles." };
  }

  for (const item of items) {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      return {
        ok: false,
        message: `Stock insuffisant pour ${variant?.product.name ?? "un article"}.`,
      };
    }
  }

  const orderItemsData = items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId)!;
    const unitPrice = Number(variant.price ?? variant.product.basePrice);
    return {
      productId: variant.productId,
      variantId: variant.id,
      productName: variant.product.name,
      variantLabel: variant.size ?? variant.color ?? undefined,
      sku: variant.sku,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItemsData.reduce((sum, item) => sum + item.lineTotal, 0);

  let discount = 0;
  let couponId: string | null = null;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (coupon && coupon.isActive) {
      if (coupon.type === "PERCENTAGE") {
        discount = subtotal * (Number(coupon.value) / 100);
      } else if (coupon.type === "FIXED_AMOUNT") {
        discount = Math.min(Number(coupon.value), subtotal);
      }
      couponId = coupon.id;
    }
  }

  const discountedSubtotal = subtotal - discount;
  const shippingCost = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const total = discountedSubtotal + shippingCost;

  const fullName = [shipping.firstName, shipping.lastName].filter(Boolean).join(" ").trim();

  const address = await prisma.address.create({
    data: {
      type: "SHIPPING",
      fullName,
      line1: shipping.line1,
      line2: shipping.line2,
      city: shipping.city,
      state: shipping.province,
      postalCode: shipping.postalCode,
      country: shipping.country,
      phone: shipping.phone,
      userId: session?.user.id,
    },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      status: "PENDING",
      subtotal,
      discountAmount: discount,
      shippingCost,
      total,
      customerEmail: shipping.email,
      userId: session?.user.id,
      couponId,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      items: { create: orderItemsData },
    },
  });

  if (couponId) {
    await prisma.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
  }

  await invalidateAdminStats();

  const stripe = getStripe();
  if (!stripe) {
    return { ok: true, orderId: order.id, orderNumber: order.orderNumber, clientSecret: null };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "eur",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    receipt_email: shipping.email,
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "stripe",
      stripePaymentIntentId: paymentIntent.id,
      status: "PENDING",
      amount: total,
    },
  });

  return {
    ok: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    clientSecret: paymentIntent.client_secret,
  };
}
