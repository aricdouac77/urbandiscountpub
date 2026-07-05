import type { Metadata } from "next";
import Link from "next/link";
import { getAdminStats } from "@/features/admin/queries/get-admin-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";

export const metadata: Metadata = {
  title: "Tableau de bord | Administration",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">
              Chiffre d&apos;affaires
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatPrice(stats.totalRevenue)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Commandes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.orderCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Clients</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.customerCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">
              Stock faible
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            <Link href="/admin/produits" className="hover:underline">
              {stats.lowStockCount}
            </Link>
          </CardContent>
        </Card>
      </div>

      {stats.pendingReturnsCount > 0 && (
        <Link
          href="/admin/retours"
          className="block rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm hover:bg-amber-500/15"
        >
          {stats.pendingReturnsCount} demande{stats.pendingReturnsCount > 1 ? "s" : ""} de retour en
          attente de traitement.
        </Link>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-sm hover:underline">
            Voir tout
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm">Aucune commande pour le moment.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Commande</th>
                  <th className="px-4 py-2 font-medium">Client</th>
                  <th className="px-4 py-2 font-medium">Statut</th>
                  <th className="px-4 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-3">
                      <Link href={`/admin/commandes/${order.id}`} className="hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{order.customerEmail}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(Number(order.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
