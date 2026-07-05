import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/features/orders/queries/get-order";
import { ClearCartOnMount } from "@/features/orders/components/clear-cart-on-mount";

export const metadata: Metadata = {
  title: "Commande confirmée",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

type ConfirmationPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) {
    notFound();
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    notFound();
  }

  const isPaid = order.status === "PAID" || order.status !== "PENDING";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <ClearCartOnMount />
      <CheckCircle2 className="text-brand mx-auto size-14" />
      <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight">
        Merci pour votre commande !
      </h1>
      <p className="text-muted-foreground mt-2">
        Commande <strong>{order.orderNumber}</strong> —{" "}
        {isPaid ? "paiement confirmé" : "en attente de paiement"}.
      </p>

      {!isPaid && (
        <p className="text-muted-foreground mt-4 text-sm">
          Le paiement en ligne n&apos;est pas configuré sur cet environnement de démonstration : la
          commande a bien été enregistrée mais aucun paiement n&apos;a été prélevé.
        </p>
      )}

      <div className="bg-muted/30 mt-8 rounded-lg border p-6 text-left">
        <p className="text-sm font-medium">Résumé</p>
        <div className="mt-4 space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.productName}
                {item.variantLabel ? ` — ${item.variantLabel}` : ""} × {item.quantity}
              </span>
              <span>{formatPrice(Number(item.lineTotal))}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t pt-4 text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(Number(order.total))}</span>
        </div>
      </div>

      <Button className="mt-8" asChild>
        <Link href="/">Continuer mes achats</Link>
      </Button>
    </div>
  );
}
