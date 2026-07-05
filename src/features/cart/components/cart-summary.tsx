import { PromoCodeForm } from "@/features/cart/components/promo-code-form";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

type CartSummaryProps = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShipping: boolean;
  couponCode?: string;
};

export function CartSummary({
  subtotal,
  discount,
  shipping,
  total,
  freeShipping,
}: CartSummaryProps) {
  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-6">
      <h2 className="font-medium">Récapitulatif</h2>

      <PromoCodeForm subtotal={subtotal} />

      <div className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="text-brand flex justify-between">
            <span>Réduction</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Livraison</span>
          <span>{freeShipping ? "Gratuite" : formatPrice(shipping)}</span>
        </div>
        {!freeShipping && (
          <p className="text-muted-foreground text-xs">Livraison gratuite dès 50€ d&apos;achat.</p>
        )}
      </div>

      <div className="flex justify-between border-t pt-4 text-base font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
