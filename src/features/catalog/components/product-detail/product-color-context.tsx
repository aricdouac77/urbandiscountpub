"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ProductColorContextValue = {
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
};

const ProductColorContext = createContext<ProductColorContextValue | null>(null);

export function ProductColorProvider({
  defaultColor,
  children,
}: {
  defaultColor: string | null;
  children: ReactNode;
}) {
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  return (
    <ProductColorContext.Provider value={{ selectedColor, setSelectedColor }}>
      {children}
    </ProductColorContext.Provider>
  );
}

export function useProductColor() {
  const context = useContext(ProductColorContext);
  if (!context) {
    throw new Error("useProductColor must be used within a ProductColorProvider");
  }
  return context;
}
