import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentSession } from "@/lib/auth-guards";
import { getOrdersForUser } from "@/features/orders/queries/get-order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("title") };
}

export default async function AccountOverviewPage() {
  const session = await getCurrentSession();
  const orders = session ? await getOrdersForUser(session.user.id) : [];
  const recentOrders = orders.slice(0, 3);
  const t = await getTranslations("account");
  const locale = (await getLocale()) as Locale;

  function formatPrice(value: number) {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            {t("welcome", { name: session?.user.name ?? "" })}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">{session?.user.email}</CardContent>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">{t("recentOrders")}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/compte/commandes">{t("viewAll")}</Link>
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("noOrders")}</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/compte/commandes/${order.orderNumber}`}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 text-sm"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-muted-foreground">
                    {new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-FR", {
                      dateStyle: "long",
                    }).format(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{formatPrice(Number(order.total))}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
