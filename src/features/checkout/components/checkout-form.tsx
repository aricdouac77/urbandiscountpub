"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createOrder } from "@/actions/checkout.actions";
import { computeCartTotals, useCartStore } from "@/features/cart/store/cart-store";
import { CheckoutOrderSummary } from "@/features/checkout/components/checkout-order-summary";
import { StripePaymentForm } from "@/features/checkout/components/stripe-payment-form";
import {
  shippingAddressSchema,
  type ShippingAddressInput,
} from "@/features/checkout/schemas/checkout.schema";

export function CheckoutForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore((state) => state.coupon);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string;
    clientSecret: string | null;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  const form = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      email: "",
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      postalCode: "",
      country: "France",
      phone: "",
    },
  });

  async function onSubmit(values: ShippingAddressInput) {
    if (items.length === 0) return;
    setIsSubmitting(true);

    const result = await createOrder({
      shipping: values,
      items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
      couponCode: coupon?.code,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    if (!result.clientSecret) {
      router.push(`/checkout/confirmation?order=${result.orderNumber}`);
      return;
    }

    setOrderResult({ orderNumber: result.orderNumber, clientSecret: result.clientSecret });
  }

  if (!mounted) {
    return null;
  }

  if (items.length === 0 && !orderResult) {
    return (
      <p className="text-muted-foreground py-24 text-center text-sm">Votre panier est vide.</p>
    );
  }

  const totals = computeCartTotals(items, coupon);

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {orderResult?.clientSecret ? (
          <StripePaymentForm
            clientSecret={orderResult.clientSecret}
            orderNumber={orderResult.orderNumber}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input autoComplete="address-line1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="line2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complément d&apos;adresse (optionnel)</FormLabel>
                    <FormControl>
                      <Input autoComplete="address-line2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input autoComplete="postal-code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input autoComplete="address-level2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <Input autoComplete="country-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone (optionnel)</FormLabel>
                      <FormControl>
                        <Input autoComplete="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Validation..." : "Continuer vers le paiement"}
              </Button>
            </form>
          </Form>
        )}
      </div>

      <CheckoutOrderSummary
        items={items}
        subtotal={totals.subtotal}
        discount={totals.discount}
        shipping={totals.shipping}
        total={totals.total}
        freeShipping={totals.freeShipping}
      />
    </div>
  );
}
