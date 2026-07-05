import type { Metadata } from "next";
import { getCategoriesAdmin, deleteCategory } from "@/actions/admin/taxonomy.actions";
import { CategoryFormDialog } from "@/features/admin/components/category-form-dialog";
import { DeleteEntityButton } from "@/features/admin/components/delete-entity-button";

export const metadata: Metadata = {
  title: "Catégories | Administration",
};

export default async function CategoriesAdminPage() {
  const categories = await getCategoriesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Catégories</h1>
        <CategoryFormDialog />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Nom</th>
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2 text-right font-medium">Produits</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="text-muted-foreground px-4 py-3">{category.slug}</td>
                <td className="px-4 py-3 text-right">{category._count.products}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <CategoryFormDialog category={category} />
                    <DeleteEntityButton
                      id={category.id}
                      entityName={category.name}
                      deleteAction={deleteCategory}
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
