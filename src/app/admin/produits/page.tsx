import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProductsAdmin } from "@/actions/admin/product.actions";
import { DeleteProductButton } from "@/features/admin/components/delete-product-button";
import { ListingPagination } from "@/features/catalog/components/listing/listing-pagination";

export const metadata: Metadata = {
  title: "Produits | Administration",
};

type ProductsAdminPageProps = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  ACTIVE: "Actif",
  ARCHIVED: "Archivé",
};

export default async function ProductsAdminPage({ searchParams }: ProductsAdminPageProps) {
  const { page: pageParam, q } = await searchParams;
  const page = Number(pageParam) || 1;
  const { products, totalPages } = await getProductsAdmin(page, q ?? "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Produits</h1>
        <Button asChild>
          <Link href="/admin/produits/nouveau">
            <Plus className="size-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <form className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un produit..."
          className="border-input bg-background flex h-9 w-full max-w-sm rounded-md border px-3 py-1 text-sm shadow-xs"
        />
        <Button type="submit" variant="outline">
          Rechercher
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Produit</th>
              <th className="px-4 py-2 font-medium">Catégorie</th>
              <th className="px-4 py-2 font-medium">Statut</th>
              <th className="px-4 py-2 text-right font-medium">Prix</th>
              <th className="px-4 py-2 text-right font-medium">Stock</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium hover:underline">{product.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">{product.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.status === "ACTIVE" ? "default" : "outline"}>
                      {STATUS_LABELS[product.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      Number(product.basePrice),
                    )}
                  </td>
                  <td
                    className={`px-4 py-3 text-right ${totalStock <= 5 ? "text-destructive" : ""}`}
                  >
                    {totalStock}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ListingPagination
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/admin/produits?q=${encodeURIComponent(q ?? "")}&page=${p}`}
      />
    </div>
  );
}
