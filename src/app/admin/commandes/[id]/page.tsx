import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderAdminDetail } from "@/actions/admin/order.actions";
import { OrderStatusSelect } from "@/features/admin/components/order-status-select";
import { ShipmentForm } from "@/features/admin/components/shipment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Détail de la commande | Administration",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

type OrderAdminDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderAdminDetailPage({ params }: OrderAdminDetailPageProps) {
  const { id } = await params;
  const order = await getOrderAdminDetail(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <p className="text-muted-foreground text-sm">
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" }).format(
              order.createdAt,
            )}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Client</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>{order.customerEmail}</p>
          {order.user && (
            <Link
              href={`/admin/clients/${order.user.id}`}
              className="text-muted-foreground hover:underline"
            >
              Voir la fiche client ({order.user.name})
            </Link>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Articles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-3 last:border-0">
              <span>
                {item.productName}
                {item.variantLabel ? ` — ${item.variantLabel}` : ""} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(Number(item.lineTotal))}</span>
            </div>
          ))}
          <div className="space-y-1 border-t pt-3">
            <div className="text-muted-foreground flex justify-between">
              <span>Sous-total</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between">
                <span>Réduction {order.coupon ? `(${order.coupon.code})` : ""}</span>
                <span>-{formatPrice(Number(order.discountAmount))}</span>
              </div>
            )}
            <div className="text-muted-foreground flex justify-between">
              <span>Livraison</span>
              <span>{formatPrice(Number(order.shippingCost))}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Adresse de livraison</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>
              {order.shippingAddress.postalCode} {order.shippingAddress.city}
            </p>
            <p>{order.shippingAddress.country}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Expédition</CardTitle>
        </CardHeader>
        <CardContent>
          <ShipmentForm
            orderId={order.id}
            defaultValues={{
              carrier: order.shipment?.carrier ?? "",
              trackingNumber: order.shipment?.trackingNumber ?? "",
              trackingUrl: order.shipment?.trackingUrl ?? "",
              status: order.shipment?.status ?? "PREPARING",
            }}
          />
        </CardContent>
      </Card>

      {order.payment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Paiement</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Fournisseur : {order.payment.provider}</p>
            <p>Statut : {order.payment.status}</p>
            {order.payment.stripePaymentIntentId && (
              <p className="text-muted-foreground">
                PaymentIntent : {order.payment.stripePaymentIntentId}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
