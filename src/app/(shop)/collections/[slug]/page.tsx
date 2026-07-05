import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/features/catalog/components/listing/product-listing";
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
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return {};
  }

  return {
    title: collection.name,
    description: collection.description ?? `Découvrez la collection ${collection.name}.`,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const { sort: sortParam, page: pageParam } = await searchParams;

  const collection = await getCollectionBySlug(slug);
  if (!collection) {
    notFound();
  }

  const sort = parseSort(sortParam);
  const page = Number(pageParam) || 1;
  const result = await getProductsByCollection(slug, page, sort);

  return (
    <ProductListing
      title={collection.name}
      description={collection.description}
      breadcrumb={[{ label: "Collections", href: "/collections" }, { label: collection.name }]}
      result={result}
      sort={sort}
      buildPageHref={(p) => `/collections/${slug}?sort=${sort}&page=${p}`}
    />
  );
}
