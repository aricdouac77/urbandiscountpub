import { useLocale, useTranslations } from "next-intl";
import { PromoCodeForm } from "@/features/cart/components/promo-code-form";
import { formatPrice } from "@/lib/currency";
import type { Locale } from "@/i18n/routing";

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
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-6">
      <h2 className="font-medium">{t("summary")}</h2>

      <PromoCodeForm subtotal={subtotal} />

      <div className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span>{formatPrice(subtotal, locale)}</span>
        </div>
        {discount > 0 && (
          <div className="text-brand flex justify-between">
            <span>{t("discount")}</span>
            <span>-{formatPrice(discount, locale)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("shipping")}</span>
          <span>{freeShipping ? t("freeShipping") : formatPrice(shipping, locale)}</span>
        </div>
        {!freeShipping && (
          <p className="text-muted-foreground text-xs">{t("freeShippingHint")}</p>
        )}
      </div>

      <div className="flex justify-between border-t pt-4 text-base font-semibold">
        <span>{t("total")}</span>
        <span>{formatPrice(total, locale)}</span>
      </div>
    </div>
  );
}
