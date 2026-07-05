import type { Metadata } from "next";
import { getCollectionsAdmin, deleteCollection } from "@/actions/admin/taxonomy.actions";
import { CollectionFormDialog } from "@/features/admin/components/collection-form-dialog";
import { DeleteEntityButton } from "@/features/admin/components/delete-entity-button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Collections | Administration",
};

export default async function CollectionsAdminPage() {
  const collections = await getCollectionsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Collections</h1>
        <CollectionFormDialog />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Nom</th>
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2 font-medium">Mise en avant</th>
              <th className="px-4 py-2 text-right font-medium">Produits</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id} className="border-t">
                <td className="px-4 py-3 font-medium">{collection.name}</td>
                <td className="text-muted-foreground px-4 py-3">{collection.slug}</td>
                <td className="px-4 py-3">
                  {collection.isFeatured && <Badge variant="secondary">Oui</Badge>}
                </td>
                <td className="px-4 py-3 text-right">{collection._count.products}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <CollectionFormDialog collection={collection} />
                    <DeleteEntityButton
                      id={collection.id}
                      entityName={collection.name}
                      deleteAction={deleteCollection}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
