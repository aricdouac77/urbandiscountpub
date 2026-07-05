import { prisma } from "@/lib/prisma";
import { getRedis } from "@/services/redis";

const CACHE_KEY = "admin:dashboard-stats";
const CACHE_TTL_SECONDS = 60;

export type AdminStats = {
  totalRevenue: number;
  orderCount: number;
  customerCount: number;
  lowStockCount: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    customerEmail: string;
    createdAt: string;
  }[];
  pendingReturnsCount: number;
};

async function computeAdminStats(): Promise<AdminStats> {
  const [revenueAgg, orderCount, customerCount, lowStockResult, recentOrders, pendingReturns] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.$queryRaw<
        [{ count: bigint }]
      >`SELECT COUNT(*)::bigint as count FROM product_variant WHERE stock <= "lowStockAt"`,
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          customerEmail: true,
          createdAt: true,
        },
      }),
      prisma.returnRequest.count({ where: { status: "REQUESTED" } }),
    ]);

  return {
    totalRevenue: Number(revenueAgg._sum.total ?? 0),
    orderCount,
    customerCount,
    lowStockCount: Number(lowStockResult[0]?.count ?? 0),
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      customerEmail: order.customerEmail,
      createdAt: order.createdAt.toISOString(),
    })),
    pendingReturnsCount: pendingReturns,
  };
}

// Admin-only, expensive multi-aggregate query — cached in Redis (60s) so
// repeated dashboard visits/refreshes don't re-scan the orders table each
// time. Falls back to a direct DB read if Redis isn't configured.
export async function getAdminStats(): Promise<AdminStats> {
  const redis = getRedis();

  if (!redis) {
    return computeAdminStats();
  }

  const cached = await redis.get<AdminStats>(CACHE_KEY);
  if (cached) {
    return cached;
  }

  const stats = await computeAdminStats();
  await redis.set(CACHE_KEY, stats, { ex: CACHE_TTL_SECONDS });
  return stats;
}

export async function invalidateAdminStats(): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(CACHE_KEY);
  }
}
