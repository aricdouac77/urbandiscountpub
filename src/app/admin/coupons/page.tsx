import type { Metadata } from "next";
import { getCouponsAdmin, deleteCoupon } from "@/actions/admin/coupon.actions";
import { CouponFormDialog } from "@/features/admin/components/coupon-form-dialog";
import { DeleteEntityButton } from "@/features/admin/components/delete-entity-button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Coupons | Administration",
};

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: "Pourcentage",
  FIXED_AMOUNT: "Montant fixe",
  FREE_SHIPPING: "Livraison gratuite",
};

export default async function CouponsAdminPage() {
  const coupons = await getCouponsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
        <CouponFormDialog />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Code</th>
              <th className="px-4 py-2 font-medium">Type</th>
              <th className="px-4 py-2 font-medium">Valeur</th>
              <th className="px-4 py-2 font-medium">Utilisations</th>
              <th className="px-4 py-2 font-medium">Statut</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-t">
                <td className="px-4 py-3 font-medium">{coupon.code}</td>
                <td className="px-4 py-3">{TYPE_LABELS[coupon.type]}</td>
                <td className="px-4 py-3">
                  {coupon.type === "PERCENTAGE"
                    ? `${coupon.value}%`
                    : coupon.type === "FIXED_AMOUNT"
                      ? `${Number(coupon.value).toFixed(2)}€`
                      : "—"}
                </td>
                <td className="px-4 py-3">
                  {coupon.usedCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={coupon.isActive ? "default" : "outline"}>
                    {coupon.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <CouponFormDialog
                      coupon={{
                        id: coupon.id,
                        code: coupon.code,
                        type: coupon.type,
                        value: Number(coupon.value),
                        minOrderTotal: coupon.minOrderTotal ? Number(coupon.minOrderTotal) : null,
                        maxUses: coupon.maxUses,
                        isActive: coupon.isActive,
                      }}
                    />
                    <DeleteEntityButton
                      id={coupon.id}
                      entityName={coupon.code}
                      deleteAction={deleteCoupon}
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
