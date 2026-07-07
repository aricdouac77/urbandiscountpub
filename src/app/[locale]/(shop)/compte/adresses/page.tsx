import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getMyAddresses } from "@/actions/address.actions";
import { AddressList } from "@/features/account/components/address-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("addresses") };
}

export default async function AddressesPage() {
  const addresses = await getMyAddresses();

  return <AddressList addresses={addresses} />;
}
