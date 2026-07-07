import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { OrderTrackingForm } from "@/features/orders/components/order-tracking-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("search");
  return { title: t("trackOrderTitle") };
}

export default async function TrackOrderPage() {
  const t = await getTranslations("search");
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("trackOrderTitle")}
      </h1>
      <p className="text-muted-foreground mt-2 text-center text-sm">{t("trackOrderHint")}</p>
      <div className="mt-10">
        <OrderTrackingForm />
      </div>
    </div>
  );
}
