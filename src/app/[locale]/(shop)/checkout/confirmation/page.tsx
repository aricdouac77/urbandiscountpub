import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/features/orders/queries/get-order";
import { ClearCartOnMount } from "@/features/orders/components/clear-cart-on-mount";
import { formatPrice } from "@/lib/currency";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout");
  return { title: t("orderConfirmedTitle") };
}

type ConfirmationPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) {
    notFound();
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    notFound();
  }

  const t = await getTranslations("checkout");
  const tCart = await getTranslations("cart");
  const locale = (await getLocale()) as Locale;

  const isPaid = order.status === "PAID" || order.status !== "PENDING";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <ClearCartOnMount />
      <CheckCircle2 className="text-brand mx-auto size-14" />
      <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight">{t("thankYou")}</h1>
      <p className="text-muted-foreground mt-2">
        {t("orderLabel", {
          orderNumber: order.orderNumber,
          status: isPaid ? t("paymentConfirmed") : t("paymentPending"),
        })}
      </p>

      {!isPaid && (
        <p className="text-muted-foreground mt-4 text-sm">{t("demoPaymentNotice")}</p>
      )}

      <div className="bg-muted/30 mt-8 rounded-lg border p-6 text-left">
        <p className="text-sm font-medium">{t("summary")}</p>
        <div className="mt-4 space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.productName}
                {item.variantLabel ? ` — ${item.variantLabel}` : ""} × {item.quantity}
              </span>
              <span>{formatPrice(Number(item.lineTotal), locale)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t pt-4 text-base font-semibold">
          <span>{tCart("total")}</span>
          <span>{formatPrice(Number(order.total), locale)}</span>
        </div>
      </div>

      <Button className="mt-8" asChild>
        <Link href="/">{tCart("continueShopping")}</Link>
      </Button>
    </div>
  );
}
