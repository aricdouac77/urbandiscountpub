import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/features/catalog/components/listing/product-listing";
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
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return {
    title: category.name,
    description: category.description ?? `Découvrez notre sélection ${category.name}.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort: sortParam, page: pageParam } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const sort = parseSort(sortParam);
  const page = Number(pageParam) || 1;
  const result = await getProductsByCategory(slug, page, sort);

  return (
    <ProductListing
      title={category.name}
      description={category.description}
      breadcrumb={[{ label: "Catégories", href: "/categories" }, { label: category.name }]}
      result={result}
      sort={sort}
      buildPageHref={(p) => `/categories/${slug}?sort=${sort}&page=${p}`}
    />
  );
}
