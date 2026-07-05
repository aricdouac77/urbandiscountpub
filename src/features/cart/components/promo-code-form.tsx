"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateCoupon } from "@/actions/coupon.actions";
import { useCartStore } from "@/features/cart/store/cart-store";

export function PromoCodeForm({ subtotal }: { subtotal: number }) {
  const coupon = useCartStore((state) => state.coupon);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await validateCoupon(code, subtotal);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      applyCoupon({ code: result.code, type: result.type, value: result.value });
      setCode("");
    });
  }

  if (coupon) {
    return (
      <div className="bg-muted/50 flex items-center justify-between rounded-md border px-3 py-2 text-sm">
        <span>
          Code <strong>{coupon.code}</strong> appliqué
        </span>
        <button
          type="button"
          onClick={removeCoupon}
          aria-label="Retirer le code promo"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code promo"
          aria-label="Code promo"
        />
        <Button type="submit" variant="outline" disabled={isPending || !code.trim()}>
          {isPending ? "..." : "Appliquer"}
        </Button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </form>
  );
}
