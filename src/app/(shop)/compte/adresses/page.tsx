import type { Metadata } from "next";
import { getMyAddresses } from "@/actions/address.actions";
import { AddressList } from "@/features/account/components/address-list";

export const metadata: Metadata = {
  title: "Mes adresses",
};

export default async function AddressesPage() {
  const addresses = await getMyAddresses();

  return <AddressList addresses={addresses} />;
}
