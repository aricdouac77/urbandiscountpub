import type { Metadata } from "next";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { CartView } from "@/features/cart/components/cart-view";
import { CartCrossSell } from "@/features/cart/components/cart-cross-sell";
import { getBestSellers } from "@/features/catalog/queries/get-home-sections";

export const metadata: Metadata = {
  title: "Mon panier",
};

export const revalidate = 300;

export default async function CartPage() {
  const suggestions = await getBestSellers(8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SiteBreadcrumb items={[{ label: "Mon panier" }]} />
      <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        Mon panier
      </h1>

      <div className="mt-8">
        <CartView />
      </div>

      <CartCrossSell suggestions={suggestions} />
    </div>
  );
}
