import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth-guards";
import { getOrderForUser } from "@/features/orders/queries/get-order";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("orderDetail") };
}

type OrderDetailPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const session = await requireUser();
  const order = await getOrderForUser(orderNumber, session.user.id);

  if (!order) {
    notFound();
  }

  const t = await getTranslations("account");
  const tCart = await getTranslations("cart");
  const locale = (await getLocale()) as Locale;

  function formatPrice(value: number) {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">{order.orderNumber}</h2>
          <p className="text-muted-foreground text-sm">
            {new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-FR", {
              dateStyle: "long",
            }).format(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.shipment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">{t("shipmentTracking")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {order.shipment.carrier && <p>{t("carrier", { carrier: order.shipment.carrier })}</p>}
            {order.shipment.trackingNumber && (
              <p>
                {t("trackingNumber")}{" "}
                {order.shipment.trackingUrl ? (
                  <a
                    href={order.shipment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {order.shipment.trackingNumber}
                  </a>
                ) : (
                  order.shipment.trackingNumber
                )}
              </p>
            )}
            <p>{t("shipmentStatus", { status: order.shipment.status })}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">{t("items")}</CardTitle>
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
              <span>{tCart("subtotal")}</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="text-brand flex justify-between">
                <span>{tCart("discount")}</span>
                <span>-{formatPrice(Number(order.discountAmount))}</span>
              </div>
            )}
            <div className="text-muted-foreground flex justify-between">
              <span>{tCart("shipping")}</span>
              <span>
                {Number(order.shippingCost) === 0
                  ? tCart("freeShipping")
                  : formatPrice(Number(order.shippingCost))}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>{tCart("total")}</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">{t("shippingAddress")}</CardTitle>
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
    </div>
  );
}
