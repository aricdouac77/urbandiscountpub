import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { CartView } from "@/features/cart/components/cart-view";
import { CartCrossSell } from "@/features/cart/components/cart-cross-sell";
import { getBestSellers } from "@/features/catalog/queries/get-home-sections";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cart");
  return { title: t("title") };
}

export const revalidate = 300;

export default async function CartPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("cart");
  const suggestions = await getBestSellers(locale, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SiteBreadcrumb items={[{ label: t("title") }]} />
      <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>

      <div className="mt-8">
        <CartView />
      </div>

      <CartCrossSell suggestions={suggestions} />
    </div>
  );
}
