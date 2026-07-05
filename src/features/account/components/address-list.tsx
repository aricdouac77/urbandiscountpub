"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { AddressFormDialog } from "@/features/account/components/address-form-dialog";
import { deleteAddress, setDefaultAddress } from "@/actions/address.actions";
import type { Address } from "@/generated/prisma/client";

export function AddressList({ addresses }: { addresses: Address[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const result = await deleteAddress(id);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Adresse supprimée");
    router.refresh();
  }

  async function handleSetDefault(id: string) {
    const result = await setDefaultAddress(id);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Adresse par défaut mise à jour");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddressFormDialog onCreated={() => router.refresh()} />
      </div>

      {addresses.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune adresse enregistrée.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="space-y-2 rounded-lg border p-4 text-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{address.fullName}</p>
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.postalCode} {address.city}
                  </p>
                  <p>{address.country}</p>
                </div>
                {address.isDefault && (
                  <span className="bg-brand/10 text-brand rounded-full px-2 py-0.5 text-xs font-medium">
                    Par défaut
                  </span>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                  >
                    <Star className="size-3.5" />
                    Définir par défaut
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs"
                >
                  <Trash2 className="size-3.5" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
