"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, ChevronDown, Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CardBrandBadge } from "@/features/checkout/components/card-brand-badge";
import { StripePaymentForm } from "@/features/checkout/components/stripe-payment-form";
import { formatPrice } from "@/lib/currency";
import { cvvLength, formatCardNumber, formatExpiry, luhnCheck } from "@/lib/card";
import type { Locale } from "@/i18n/routing";
import {
  shippingAddressSchema,
  type ShippingAddressInput,
} from "@/features/checkout/schemas/checkout.schema";

const COUNTRIES = [
  "France",
  "Belgique",
  "Luxembourg",
  "Suisse",
  "Canada",
  "États-Unis",
  "Royaume-Uni",
];

// Visual only for now: the express surcharge isn't yet recomputed server-side
// (createOrder always prices standard shipping) — real per-method pricing
// lands alongside the Stripe integration pass.
const EXPRESS_SHIPPING_SURCHARGE = 9.9;

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
  const [showSummary, setShowSummary] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [testCard, setTestCard] = useState({
    cardNumber: "",
    cardholderName: "",
    expiry: "",
    cvv: "",
  });
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale() as Locale;

  useEffect(() => setMounted(true), []);

  const form = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      line1: "",
      line2: "",
      city: "",
      province: "",
      postalCode: "",
      country: "France",
      phone: "",
      marketingOptIn: true,
    },
  });

  async function onSubmit(values: ShippingAddressInput) {
    if (items.length === 0) return;
    setIsSubmitting(true);

    const result = await createOrder({
      shipping: values,
      items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
      couponCode: coupon?.code,
      testCard,
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
    return <p className="text-muted-foreground py-24 text-center text-sm">{t("empty")}</p>;
  }

  const totals = computeCartTotals(items, coupon);
  const isExpress = shippingMethod === "express";
  const displayShipping = isExpress ? totals.shipping + EXPRESS_SHIPPING_SURCHARGE : totals.shipping;
  const displayFreeShipping = !isExpress && totals.freeShipping;
  const displayTotal = totals.total + (isExpress ? EXPRESS_SHIPPING_SURCHARGE : 0);

  const { brand: cardBrand, digits: cardDigits } = formatCardNumber(testCard.cardNumber);
  const isCardNumberValid = luhnCheck(cardDigits);

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {orderResult?.clientSecret ? (
          <StripePaymentForm
            clientSecret={orderResult.clientSecret}
            orderNumber={orderResult.orderNumber}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShowSummary((v) => !v)}
              className="text-muted-foreground hover:text-foreground mb-6 flex w-full items-center justify-between border-y py-3 text-sm lg:hidden"
            >
              <span className="flex items-center gap-1">
                {showSummary ? t("hideOrderSummary") : t("showOrderSummary")}
                <ChevronDown
                  className={`size-4 transition-transform ${showSummary ? "rotate-180" : ""}`}
                />
              </span>
              <span className="text-foreground font-semibold">
                {formatPrice(displayTotal, locale)}
              </span>
            </button>
            {showSummary && (
              <div className="mb-8 lg:hidden">
                <CheckoutOrderSummary
                  items={items}
                  subtotal={totals.subtotal}
                  discount={totals.discount}
                  shipping={displayShipping}
                  total={displayTotal}
                  freeShipping={displayFreeShipping}
                />
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <section className="space-y-4">
                  <h2 className="font-heading text-lg font-semibold">{t("contactTitle")}</h2>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input type="email" autoComplete="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marketingOptIn"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">{t("marketingOptIn")}</FormLabel>
                      </FormItem>
                    )}
                  />
                </section>

                <section className="space-y-4">
                  <h2 className="font-heading text-lg font-semibold">{t("deliveryTitle")}</h2>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("countryRegion")}</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs"
                          >
                            {COUNTRIES.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("firstName")}</FormLabel>
                          <FormControl>
                            <Input autoComplete="given-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("lastName")}</FormLabel>
                          <FormControl>
                            <Input autoComplete="family-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="line1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("address")}</FormLabel>
                        <FormControl>
                          <Input autoComplete="address-line1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!showLine2 ? (
                    <button
                      type="button"
                      onClick={() => setShowLine2(true)}
                      className="text-brand text-sm font-medium hover:underline"
                    >
                      + {t("addApartment")}
                    </button>
                  ) : (
                    <FormField
                      control={form.control}
                      name="line2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("addressLine2")}</FormLabel>
                          <FormControl>
                            <Input autoComplete="address-line2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("city")}</FormLabel>
                        <FormControl>
                          <Input autoComplete="address-level2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("province")}</FormLabel>
                          <FormControl>
                            <Input autoComplete="address-level1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("postalCode")}</FormLabel>
                          <FormControl>
                            <Input autoComplete="postal-code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input autoComplete="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <section className="space-y-4">
                  <h2 className="font-heading text-lg font-semibold">
                    {t("shippingMethodTitle")}
                  </h2>
                  <div className="divide-y rounded-md border">
                    <label className="flex cursor-pointer items-center gap-3 p-4">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="accent-brand size-4"
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{t("standardShipping")}</span>
                        <span className="text-muted-foreground text-xs">
                          {t("standardShippingDelivery")}
                        </span>
                      </span>
                      <span className="text-sm font-medium">
                        {totals.freeShipping ? tCart("freeShipping") : formatPrice(totals.shipping, locale)}
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 p-4">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="accent-brand size-4"
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{t("expressShipping")}</span>
                        <span className="text-muted-foreground text-xs">
                          {t("expressShippingDelivery")}
                        </span>
                      </span>
                      <span className="text-sm font-medium">
                        {formatPrice(totals.shipping + EXPRESS_SHIPPING_SURCHARGE, locale)}
                      </span>
                    </label>
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="font-heading text-lg font-semibold">{t("paymentTitle")}</h2>
                    <p className="text-muted-foreground text-sm">{t("paymentSecureNotice")}</p>
                  </div>

                  <div className="rounded-md border">
                    <div className="flex items-center gap-3 border-b p-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked
                        readOnly
                        className="accent-brand size-4"
                      />
                      <span className="flex-1 text-sm font-medium">{t("creditCard")}</span>
                      <CardBrandBadge brand={cardBrand} />
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">{t("cardNumber")}</label>
                        <div className="relative">
                          <Input
                            placeholder="4242 4242 4242 4242"
                            autoComplete="off"
                            inputMode="numeric"
                            className="pr-10"
                            value={testCard.cardNumber}
                            onChange={(e) => {
                              const { formatted } = formatCardNumber(e.target.value);
                              setTestCard((prev) => ({ ...prev, cardNumber: formatted }));
                            }}
                          />
                          {isCardNumberValid && (
                            <CheckCircle2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-emerald-600" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">{t("cardholderName")}</label>
                        <Input
                          autoComplete="off"
                          value={testCard.cardholderName}
                          onChange={(e) =>
                            setTestCard((prev) => ({
                              ...prev,
                              cardholderName: e.target.value.toUpperCase(),
                            }))
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">{t("expiryDate")}</label>
                          <Input
                            placeholder="MM/AA"
                            autoComplete="off"
                            inputMode="numeric"
                            value={testCard.expiry}
                            onChange={(e) =>
                              setTestCard((prev) => ({
                                ...prev,
                                expiry: formatExpiry(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">{t("cvv")}</label>
                          <Input
                            placeholder={cardBrand === "amex" ? "CVV" : "CVC"}
                            autoComplete="off"
                            inputMode="numeric"
                            value={testCard.cvv}
                            onChange={(e) => {
                              const digits = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, cvvLength(cardBrand));
                              setTestCard((prev) => ({ ...prev, cvv: digits }));
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="size-3.5 shrink-0" />
                        {t("pciNotice")}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="font-heading text-lg font-semibold">
                      {t("billingAddressTitle")}
                    </h2>
                    <p className="text-muted-foreground text-sm">{t("billingAddressHint")}</p>
                  </div>
                  <div className="divide-y rounded-md border">
                    <label className="flex cursor-pointer items-center gap-3 p-4">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={billingSameAsShipping}
                        onChange={() => setBillingSameAsShipping(true)}
                        className="accent-brand size-4"
                      />
                      <span className="text-sm font-medium">{t("sameAsShipping")}</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 p-4">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={!billingSameAsShipping}
                        onChange={() => setBillingSameAsShipping(false)}
                        className="accent-brand size-4"
                      />
                      <span className="text-sm font-medium">{t("useAnotherBilling")}</span>
                    </label>
                  </div>
                </section>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("submitting") : t("payNow")}
                </Button>

                <div className="space-y-3 text-center">
                  <p className="text-muted-foreground text-xs">{t("trustNotice")}</p>
                  <div className="text-muted-foreground flex items-center justify-center gap-4">
                    <Lock className="size-4" />
                    <ShieldCheck className="size-4" />
                    <RotateCcw className="size-4" />
                    <Truck className="size-4" />
                  </div>
                  <p className="text-muted-foreground bg-muted/40 rounded-md p-3 text-xs">
                    {t("freeReturnsNotice")}
                  </p>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>

      <div className="hidden lg:block">
        <CheckoutOrderSummary
          items={items}
          subtotal={totals.subtotal}
          discount={totals.discount}
          shipping={totals.shipping}
          total={totals.total}
          freeShipping={totals.freeShipping}
        />
      </div>
    </div>
  );
}
