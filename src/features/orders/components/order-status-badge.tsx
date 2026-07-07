import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PAID: "secondary",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const t = useTranslations("account");
  const key = `orderStatus_${status}` as Parameters<typeof t>[0];

  return (
    <Badge variant={STATUS_VARIANTS[status] ?? "outline"}>
      {t.has(key) ? t(key) : status}
    </Badge>
  );
}
