import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserAdminDetail } from "@/actions/admin/user.actions";
import { UserRoleSelect } from "@/features/admin/components/user-role-select";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Fiche client | Administration",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

type ClientDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const user = await getUserAdminDetail(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <UserRoleSelect userId={user.id} role={user.role} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Commandes</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{user._count.orders}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">
              Avis publiés
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">{user._count.reviews}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {user.orders.length === 0 ? (
            <p className="text-muted-foreground">Aucune commande.</p>
          ) : (
            user.orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/commandes/${order.id}`}
                className="hover:bg-muted/50 flex items-center justify-between rounded-md border p-3"
              >
                <span>{order.orderNumber}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatPrice(Number(order.total))}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {user.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Adresses</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            {user.addresses.map((address) => (
              <div key={address.id} className="rounded-md border p-3">
                <p className="font-medium">{address.fullName}</p>
                <p>{address.line1}</p>
                <p>
                  {address.postalCode} {address.city}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
