import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ProductListing } from "@/features/catalog/components/listing/product-listing";
import { localize, localizeNullable } from "@/lib/locale-content";
import type { Locale } from "@/i18n/routing";
import {
  getCollectionBySlug,
  getProductsByCollection,
  type SortOption,
} from "@/features/catalog/queries/get-product-listing";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
};

const VALID_SORTS: SortOption[] = ["newest", "price-asc", "price-desc"];

function parseSort(value: string | undefined): SortOption {
  return VALID_SORTS.includes(value as SortOption) ? (value as SortOption) : "newest";
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return {};
  }

  const name = localize(collection.name, collection.nameEn, locale);

  return {
    title: name,
    description:
      localizeNullable(collection.description, collection.descriptionEn, locale) ??
      `Découvrez la collection ${name}.`,
    alternates: { canonical: `/${locale}/collections/${slug}` },
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const { sort: sortParam, page: pageParam } = await searchParams;
  const locale = (await getLocale()) as Locale;

  const collection = await getCollectionBySlug(slug);
  if (!collection) {
    notFound();
  }

  const name = localize(collection.name, collection.nameEn, locale);
  const description = localizeNullable(collection.description, collection.descriptionEn, locale);
  const t = await getTranslations("product");

  const sort = parseSort(sortParam);
  const page = Number(pageParam) || 1;
  const result = await getProductsByCollection(slug, page, sort, locale);

  return (
    <ProductListing
      title={name}
      description={description}
      breadcrumb={[{ label: t("collectionsLabel"), href: "/collections" }, { label: name }]}
      result={result}
      sort={sort}
      buildPageHref={(p) => `/collections/${slug}?sort=${sort}&page=${p}`}
    />
  );
}
