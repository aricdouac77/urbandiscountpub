"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { trackOrder, type TrackOrderResult } from "@/actions/tracking.actions";
import { formatPrice } from "@/lib/currency";
import type { Locale } from "@/i18n/routing";

export function OrderTrackingForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TrackOrderResult | null>(null);
  const t = useTranslations("search");
  const tCart = useTranslations("cart");
  const locale = useLocale() as Locale;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    const response = await trackOrder(orderNumber, email);
    setResult(response);
    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">{t("orderNumberLabel")}</Label>
          <Input
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="UD-XXXXXXXXXX"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("orderEmailLabel")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("tracking") : t("trackButton")}
        </Button>
      </form>

      {result && !result.ok && <p className="text-destructive mt-6 text-sm">{result.message}</p>}

      {result?.ok && (
        <div className="mt-8 space-y-4 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{result.order.orderNumber}</p>
              <p className="text-muted-foreground text-sm">
                {new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-FR", {
                  dateStyle: "long",
                }).format(result.order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={result.order.status} />
          </div>

          {result.order.shipment && (
            <div className="border-t pt-4 text-sm">
              <p className="font-medium">{t("shipmentLabel")}</p>
              {result.order.shipment.carrier && (
                <p>{t("carrierLabel", { carrier: result.order.shipment.carrier })}</p>
              )}
              {result.order.shipment.trackingNumber && (
                <p>
                  {t("trackingNumberLabel", { number: result.order.shipment.trackingNumber })}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2 border-t pt-4 text-sm">
            {result.order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(Number(item.lineTotal), locale)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t pt-4 text-base font-semibold">
            <span>{tCart("total")}</span>
            <span>{formatPrice(Number(result.order.total), locale)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
