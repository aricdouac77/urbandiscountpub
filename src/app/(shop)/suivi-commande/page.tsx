import type { Metadata } from "next";
import { OrderTrackingForm } from "@/features/orders/components/order-tracking-form";

export const metadata: Metadata = {
  title: "Suivi de commande",
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-center text-3xl font-semibold tracking-tight sm:text-4xl">
        Suivi de commande
      </h1>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        Renseignez votre numéro de commande et votre e-mail pour consulter son statut.
      </p>
      <div className="mt-10">
        <OrderTrackingForm />
      </div>
    </div>
  );
}
