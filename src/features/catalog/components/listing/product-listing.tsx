import { useTranslations } from "next-intl";
import { ProductCard } from "@/features/catalog/components/product-card";
import { SortSelect } from "@/features/catalog/components/listing/sort-select";
import { ListingPagination } from "@/features/catalog/components/listing/listing-pagination";
import { SiteBreadcrumb, type BreadcrumbEntry } from "@/components/layout/site-breadcrumb";
import type {
  ProductListingResult,
  SortOption,
} from "@/features/catalog/queries/get-product-listing";

type ProductListingProps = {
  title: string;
  description?: string | null;
  breadcrumb: BreadcrumbEntry[];
  result: ProductListingResult;
  sort: SortOption;
  buildPageHref: (page: number) => string;
};

export function ProductListing({
  title,
  description,
  breadcrumb,
  result,
  sort,
  buildPageHref,
}: ProductListingProps) {
  const t = useTranslations("product");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SiteBreadcrumb items={breadcrumb} />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">{description}</p>
          )}
          <p className="text-muted-foreground mt-2 text-sm">
            {t("productCount", { count: result.totalCount })}
          </p>
        </div>
        <SortSelect value={sort} />
      </div>

      {result.products.length === 0 ? (
        <p className="text-muted-foreground mt-16 text-center text-sm">{t("noProducts")}</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {result.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <ListingPagination
            page={result.page}
            totalPages={result.totalPages}
            buildHref={buildPageHref}
          />
        </>
      )}
    </div>
  );
}
