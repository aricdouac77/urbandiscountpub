import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth-guards";
import { getOrdersForUser } from "@/features/orders/queries/get-order";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { formatPrice } from "@/lib/currency";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("orders") };
}

export default async function OrdersPage() {
  const session = await requireUser();
  const orders = await getOrdersForUser(session.user.id);
  const t = await getTranslations("account");
  const locale = (await getLocale()) as Locale;

  if (orders.length === 0) {
    return <p className="text-muted-foreground text-sm">{t("noOrders")}</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/compte/commandes/${order.orderNumber}`}
          className="hover:bg-muted/50 flex flex-col gap-2 rounded-lg border p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">{order.orderNumber}</p>
            <p className="text-muted-foreground">
              {new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-FR", {
                dateStyle: "long",
              }).format(order.createdAt)}{" "}
              · {t("itemCount", { count: order.items.length })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">{formatPrice(Number(order.total), locale)}</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
