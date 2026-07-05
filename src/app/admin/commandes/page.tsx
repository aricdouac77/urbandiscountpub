import type { Metadata } from "next";
import Link from "next/link";
import { getOrdersAdmin } from "@/actions/admin/order.actions";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { ListingPagination } from "@/features/catalog/components/listing/listing-pagination";
import type { OrderStatus } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Commandes | Administration",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

const STATUS_FILTERS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Toutes" },
  { value: "PENDING", label: "En attente" },
  { value: "PAID", label: "Payées" },
  { value: "PROCESSING", label: "En préparation" },
  { value: "SHIPPED", label: "Expédiées" },
  { value: "DELIVERED", label: "Livrées" },
  { value: "CANCELLED", label: "Annulées" },
];

type OrdersAdminPageProps = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

export default async function OrdersAdminPage({ searchParams }: OrdersAdminPageProps) {
  const { page: pageParam, status } = await searchParams;
  const page = Number(pageParam) || 1;
  const statusFilter = status && status !== "ALL" ? (status as OrderStatus) : undefined;
  const { orders, totalPages } = await getOrdersAdmin(page, statusFilter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Commandes</h1>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={`/admin/commandes?status=${filter.value}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              (status ?? "ALL") === filter.value ? "bg-foreground text-background" : ""
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Commande</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Client</th>
              <th className="px-4 py-2 font-medium">Statut</th>
              <th className="px-4 py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="font-medium hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
                    order.createdAt,
                  )}
                </td>
                <td className="px-4 py-3">{order.customerEmail}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(Number(order.total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ListingPagination
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/admin/commandes?status=${status ?? "ALL"}&page=${p}`}
      />
    </div>
  );
}
