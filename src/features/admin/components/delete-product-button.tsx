"use client";

import { deleteProduct } from "@/actions/admin/product.actions";
import { DeleteEntityButton } from "@/features/admin/components/delete-entity-button";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <DeleteEntityButton
      id={productId}
      entityName={productName}
      deleteAction={deleteProduct}
      description="Le produit, ses variantes et ses images seront définitivement supprimés."
    />
  );
}
