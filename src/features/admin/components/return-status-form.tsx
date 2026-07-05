"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateReturnRequest } from "@/actions/admin/return.actions";
import type { ReturnStatus } from "@/generated/prisma/client";

const STATUS_OPTIONS: { value: ReturnStatus; label: string }[] = [
  { value: "REQUESTED", label: "Demandé" },
  { value: "APPROVED", label: "Approuvé" },
  { value: "REJECTED", label: "Refusé" },
  { value: "RECEIVED", label: "Reçu" },
  { value: "REFUNDED", label: "Remboursé" },
];

type ReturnStatusFormProps = {
  returnId: string;
  status: ReturnStatus;
  refundAmount: number | null;
};

export function ReturnStatusForm({ returnId, status, refundAmount }: ReturnStatusFormProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<ReturnStatus>(status);
  const [amount, setAmount] = useState(refundAmount?.toString() ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updateReturnRequest(returnId, {
        status: selectedStatus,
        refundAmount: amount === "" ? null : Number(amount),
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Retour mis à jour");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ReturnStatus)}>
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        step="0.01"
        placeholder="Remboursement €"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-32"
      />
      <Button size="sm" onClick={handleSave} disabled={isPending}>
        {isPending ? "..." : "Enregistrer"}
      </Button>
    </div>
  );
}
