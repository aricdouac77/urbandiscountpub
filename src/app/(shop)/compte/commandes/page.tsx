import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth-guards";
import { getOrdersForUser } from "@/features/orders/queries/get-order";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

export const metadata: Metadata = {
  title: "Mes commandes",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export default async function OrdersPage() {
  const session = await requireUser();
  const orders = await getOrdersForUser(session.user.id);

  if (orders.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Vous n&apos;avez pas encore de commande.</p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/compte/commandes/${order.orderNumber}`}
          className="hover:bg-muted/50 flex flex-col gap-2 rounded-lg border p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">{order.orderNumber}</p>
            <p className="text-muted-foreground">
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(order.createdAt)} ·{" "}
              {order.items.length} article{order.items.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">{formatPrice(Number(order.total))}</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
