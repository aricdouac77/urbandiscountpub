import Image from "next/image";
import type { CartItem } from "@/features/cart/store/cart-store";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

type CheckoutOrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShipping: boolean;
};

export function CheckoutOrderSummary({
  items,
  subtotal,
  discount,
  shipping,
  total,
  freeShipping,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-6">
      <h2 className="font-medium">Votre commande</h2>

      <div className="max-h-72 space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-md">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              <span className="bg-foreground text-background absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full text-[10px]">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              {item.size && <p className="text-muted-foreground text-xs">Taille : {item.size}</p>}
            </div>
            <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

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
      </div>

      <div className="flex justify-between border-t pt-4 text-base font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
