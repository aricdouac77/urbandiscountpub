import type { Metadata } from "next";
import { ProductListing } from "@/features/catalog/components/listing/product-listing";
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

export const metadata: Metadata = {
  title: "Résultats de recherche",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", sort: sortParam, page: pageParam } = await searchParams;
  const sort = parseSort(sortParam);
  const page = Number(pageParam) || 1;

  const result = await getProductsBySearch(q, page, sort);

  return (
    <ProductListing
      title={q ? `Résultats pour « ${q} »` : "Recherche"}
      description={q ? undefined : "Saisissez un terme de recherche pour trouver un produit."}
      breadcrumb={[{ label: "Recherche" }]}
      result={result}
      sort={sort}
      buildPageHref={(p) => `/recherche?q=${encodeURIComponent(q)}&sort=${sort}&page=${p}`}
    />
  );
}
