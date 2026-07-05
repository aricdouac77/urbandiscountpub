"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/actions/admin/user.actions";
import type { Role } from "@/generated/prisma/client";

export function UserRoleSelect({ userId, role }: { userId: string; role: Role }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await updateUserRole(userId, value as Role);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Rôle mis à jour");
      router.refresh();
    });
  }

  return (
    <Select value={role} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="CUSTOMER">Client</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="SUPER_ADMIN">Super admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
