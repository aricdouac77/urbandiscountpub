"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { trackOrder, type TrackOrderResult } from "@/actions/tracking.actions";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export function OrderTrackingForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TrackOrderResult | null>(null);

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
          <Label htmlFor="orderNumber">Numéro de commande</Label>
          <Input
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="UD-XXXXXXXXXX"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail utilisé lors de la commande</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Recherche..." : "Suivre ma commande"}
        </Button>
      </form>

      {result && !result.ok && <p className="text-destructive mt-6 text-sm">{result.message}</p>}

      {result?.ok && (
        <div className="mt-8 space-y-4 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{result.order.orderNumber}</p>
              <p className="text-muted-foreground text-sm">
                {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                  result.order.createdAt,
                )}
              </p>
            </div>
            <OrderStatusBadge status={result.order.status} />
          </div>

          {result.order.shipment && (
            <div className="border-t pt-4 text-sm">
              <p className="font-medium">Expédition</p>
              {result.order.shipment.carrier && (
                <p>Transporteur : {result.order.shipment.carrier}</p>
              )}
              {result.order.shipment.trackingNumber && (
                <p>Numéro de suivi : {result.order.shipment.trackingNumber}</p>
              )}
            </div>
          )}

          <div className="space-y-2 border-t pt-4 text-sm">
            {result.order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(Number(item.lineTotal))}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(Number(result.order.total))}</span>
          </div>
        </div>
      )}
    </div>
  );
}
