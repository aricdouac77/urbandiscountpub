"use client";

import { useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { getClientStripe } from "@/lib/stripe-client";

type StripePaymentFormProps = {
  clientSecret: string;
  orderNumber: string;
};

function PaymentFormInner({ orderNumber }: { orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmation?order=${orderNumber}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Le paiement a échoué. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || isSubmitting}>
        {isSubmitting ? "Traitement..." : "Payer maintenant"}
      </Button>
    </form>
  );
}

export function StripePaymentForm({ clientSecret, orderNumber }: StripePaymentFormProps) {
  const stripePromise = getClientStripe();

  if (!stripePromise) {
    return (
      <p className="text-destructive text-sm">
        Le paiement en ligne n&apos;est pas configuré (clé publique Stripe manquante).
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormInner orderNumber={orderNumber} />
    </Elements>
  );
}
