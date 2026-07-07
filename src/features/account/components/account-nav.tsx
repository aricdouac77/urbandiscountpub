"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function AccountNav() {
  const pathname = usePathname();
  const t = useTranslations("account");

  const NAV_ITEMS = [
    { href: "/compte", label: t("overview") },
    { href: "/compte/commandes", label: t("orders") },
    { href: "/compte/adresses", label: t("addresses") },
    { href: "/compte/profil", label: t("profile") },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto border-b pb-px lg:flex-col lg:border-b-0 lg:pb-0">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/compte" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap",
              isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
