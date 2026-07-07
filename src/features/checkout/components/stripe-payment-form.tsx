"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations("checkout");
  const locale = useLocale();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/checkout/confirmation?order=${orderNumber}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? t("paymentFailed"));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || isSubmitting}>
        {isSubmitting ? t("processing") : t("payNow")}
      </Button>
    </form>
  );
}

export function StripePaymentForm({ clientSecret, orderNumber }: StripePaymentFormProps) {
  const stripePromise = getClientStripe();
  const t = useTranslations("checkout");

  if (!stripePromise) {
    return <p className="text-destructive text-sm">{t("paymentNotConfigured")}</p>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormInner orderNumber={orderNumber} />
    </Elements>
  );
}
