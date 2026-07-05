import type { Metadata } from "next";
import Link from "next/link";
import { getReturnsAdmin } from "@/actions/admin/return.actions";
import { ReturnStatusForm } from "@/features/admin/components/return-status-form";

export const metadata: Metadata = {
  title: "Retours | Administration",
};

export default async function ReturnsAdminPage() {
  const returns = await getReturnsAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Retours</h1>

      {returns.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune demande de retour.</p>
      ) : (
        <div className="space-y-4">
          {returns.map((request) => (
            <div key={request.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Link
                    href={`/admin/commandes/${request.orderId}`}
                    className="font-medium hover:underline"
                  >
                    {request.order.orderNumber}
                  </Link>
                  <p className="text-muted-foreground text-sm">
                    {request.orderItem.productName} — {request.user.name} ({request.user.email})
                  </p>
                </div>
                <p className="text-muted-foreground text-xs">
                  {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
                    request.createdAt,
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Motif : {request.reason}</p>
                {request.comment && (
                  <p className="text-muted-foreground text-sm">{request.comment}</p>
                )}
              </div>
              <ReturnStatusForm
                returnId={request.id}
                status={request.status}
                refundAmount={request.refundAmount ? Number(request.refundAmount) : null}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
