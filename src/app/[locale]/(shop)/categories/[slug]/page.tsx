import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ProductListing } from "@/features/catalog/components/listing/product-listing";
import { localize, localizeNullable } from "@/lib/locale-content";
import type { Locale } from "@/i18n/routing";
import {
  getCategoryBySlug,
  getProductsByCategory,
  type SortOption,
} from "@/features/catalog/queries/get-product-listing";

export const revalidate = 300;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
};

const VALID_SORTS: SortOption[] = ["newest", "price-asc", "price-desc"];

function parseSort(value: string | undefined): SortOption {
  return VALID_SORTS.includes(value as SortOption) ? (value as SortOption) : "newest";
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  const name = localize(category.name, category.nameEn, locale);

  return {
    title: name,
    description:
      localizeNullable(category.description, category.descriptionEn, locale) ??
      `Découvrez notre sélection ${name}.`,
    alternates: { canonical: `/${locale}/categories/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort: sortParam, page: pageParam } = await searchParams;
  const locale = (await getLocale()) as Locale;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const name = localize(category.name, category.nameEn, locale);
  const description = localizeNullable(category.description, category.descriptionEn, locale);
  const t = await getTranslations("product");

  const sort = parseSort(sortParam);
  const page = Number(pageParam) || 1;
  const result = await getProductsByCategory(slug, page, sort, locale);

  return (
    <ProductListing
      title={name}
      description={description}
      breadcrumb={[{ label: t("categories"), href: "/categories" }, { label: name }]}
      result={result}
      sort={sort}
      buildPageHref={(p) => `/categories/${slug}?sort=${sort}&page=${p}`}
    />
  );
}
