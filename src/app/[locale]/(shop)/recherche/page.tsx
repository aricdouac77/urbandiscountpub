import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ProductListing } from "@/features/catalog/components/listing/product-listing";
import type { Locale } from "@/i18n/routing";
import {
  getProductsBySearch,
  type SortOption,
} from "@/features/catalog/queries/get-product-listing";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
};

const VALID_SORTS: SortOption[] = ["newest", "price-asc", "price-desc"];

function parseSort(value: string | undefined): SortOption {
  return VALID_SORTS.includes(value as SortOption) ? (value as SortOption) : "newest";
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("search");
  return { title: t("resultsTitle") };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", sort: sortParam, page: pageParam } = await searchParams;
  const sort = parseSort(sortParam);
  const page = Number(pageParam) || 1;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("search");

  const result = await getProductsBySearch(q, page, sort, locale);

  return (
    <ProductListing
      title={q ? t("resultsFor", { query: q }) : t("searchLabel")}
      description={q ? undefined : t("searchHint")}
      breadcrumb={[{ label: t("searchLabel") }]}
      result={result}
      sort={sort}
      buildPageHref={(p) => `/recherche?q=${encodeURIComponent(q)}&sort=${sort}&page=${p}`}
    />
  );
}
