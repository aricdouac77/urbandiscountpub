import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/features/home/components/hero-section";
import type { Locale } from "@/i18n/routing";
import { PromoBanner } from "@/features/home/components/promo-banner";
import { CollectionsSection } from "@/features/home/components/collections-section";
import { TestimonialsSection } from "@/features/home/components/testimonials-section";
import { InstagramSection } from "@/features/home/components/instagram-section";
import { NewsletterSection } from "@/features/home/components/newsletter-section";
import { ProductGridSection } from "@/features/catalog/components/product-grid-section";
import {
  getBestSellers,
  getFeaturedCollections,
  getFeaturedProducts,
  getNewArrivals,
} from "@/features/catalog/queries/get-home-sections";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home");
  const [featured, bestSellers, newArrivals, collections] = await Promise.all([
    getFeaturedProducts(locale),
    getBestSellers(locale),
    getNewArrivals(locale),
    getFeaturedCollections(locale),
  ]);

  return (
    <>
      <HeroSection />
      <ProductGridSection
        title={t("featuredTitle")}
        subtitle={t("featuredSubtitle")}
        href="/collections/nouveautes"
        products={featured}
      />
      <PromoBanner />
      <ProductGridSection
        title={t("bestSellersTitle")}
        subtitle={t("bestSellersSubtitle")}
        href="/collections/meilleures-ventes"
        products={bestSellers}
      />
      <CollectionsSection collections={collections} />
      <ProductGridSection
        title={t("newArrivalsTitle")}
        subtitle={t("newArrivalsSubtitle")}
        href="/collections/nouveautes"
        products={newArrivals}
      />
      <TestimonialsSection />
      <InstagramSection />
      <NewsletterSection />
    </>
  );
}
