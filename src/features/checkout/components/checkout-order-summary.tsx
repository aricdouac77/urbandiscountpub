import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { CartItem } from "@/features/cart/store/cart-store";
import { formatPrice, formatPriceInCurrency, type CurrencyCode } from "@/lib/currency";
import type { Locale } from "@/i18n/routing";

type CheckoutOrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShipping: boolean;
  currency?: CurrencyCode;
};

export function CheckoutOrderSummary({
  items,
  subtotal,
  discount,
  shipping,
  total,
  freeShipping,
  currency,
}: CheckoutOrderSummaryProps) {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale() as Locale;
  const format = (value: number) =>
    currency ? formatPriceInCurrency(value, currency) : formatPrice(value, locale);

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-6">
      <h2 className="font-medium">{t("orderSummary")}</h2>

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
              {item.size && (
                <p className="text-muted-foreground text-xs">
                  {tCart("size", { size: item.size })}
                </p>
              )}
            </div>
            <span className="text-sm font-medium">
              {format(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tCart("subtotal")}</span>
          <span>{format(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="text-brand flex justify-between">
            <span>{tCart("discount")}</span>
            <span>-{format(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">{tCart("shipping")}</span>
          <span>{freeShipping ? tCart("freeShipping") : format(shipping)}</span>
        </div>
      </div>

      <div className="flex justify-between border-t pt-4 text-base font-semibold">
        <span>{tCart("total")}</span>
        <span>{format(total)}</span>
      </div>
    </div>
  );
}
