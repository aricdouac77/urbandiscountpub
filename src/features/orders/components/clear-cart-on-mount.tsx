"use client";

import { useEffect } from "react";
import { useCartStore } from "@/features/cart/store/cart-store";

export function ClearCartOnMount() {
  const clear = useCartStore((state) => state.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
