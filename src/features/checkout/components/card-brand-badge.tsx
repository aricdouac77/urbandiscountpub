import { CreditCard } from "lucide-react";
import type { CardBrand } from "@/lib/card";

export function CardBrandBadge({ brand }: { brand: CardBrand }) {
  if (brand === "visa") {
    return (
      <span className="text-[15px] font-black tracking-tight text-[#1A1F71] italic">VISA</span>
    );
  }

  if (brand === "mastercard") {
    return (
      <span className="relative flex h-5 w-8 items-center">
        <span className="absolute left-0 size-5 rounded-full bg-[#EB001B] opacity-90" />
        <span className="absolute left-2.5 size-5 rounded-full bg-[#F79E1B] opacity-90 mix-blend-multiply" />
      </span>
    );
  }

  if (brand === "amex") {
    return (
      <span className="rounded bg-[#2E77BC] px-1.5 py-0.5 text-[10px] font-bold text-white">
        AMEX
      </span>
    );
  }

  if (brand === "discover") {
    return <span className="text-[13px] font-bold text-[#FF6000]">Discover</span>;
  }

  return <CreditCard className="text-muted-foreground size-5" />;
}
