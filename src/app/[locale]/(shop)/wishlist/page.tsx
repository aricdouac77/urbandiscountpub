import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth-guards";
import { getWishlistProducts } from "@/actions/wishlist.actions";
import { ProductCard } from "@/features/catalog/components/product-card";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("wishlist");
  return { title: t("title") };
}

export default async function WishlistPage() {
  await requireUser();
  const products = await getWishlistProducts();
  const t = await getTranslations("wishlist");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SiteBreadcrumb items={[{ label: t("title") }]} />
      <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground mt-16 text-center text-sm">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
