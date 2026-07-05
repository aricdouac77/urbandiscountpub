import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth-guards";
import { getOrdersForUser } from "@/features/orders/queries/get-order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

export const metadata: Metadata = {
  title: "Mon compte",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export default async function AccountOverviewPage() {
  const session = await getCurrentSession();
  const orders = session ? await getOrdersForUser(session.user.id) : [];
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Bienvenue, {session?.user.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">{session?.user.email}</CardContent>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Commandes récentes</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/compte/commandes">Voir tout</Link>
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm">Vous n&apos;avez pas encore de commande.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/compte/commandes/${order.orderNumber}`}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 text-sm"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-muted-foreground">
                    {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                      order.createdAt,
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{formatPrice(Number(order.total))}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
