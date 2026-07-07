"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { getTrendingSearches, searchProductsPreview } from "@/actions/search.actions";
import { formatPrice } from "@/lib/currency";
import type { Locale } from "@/i18n/routing";

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("search");
  const locale = useLocale() as Locale;

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["search-preview", debouncedQuery],
    queryFn: () => searchProductsPreview(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
  });

  const { data: trending = [] } = useQuery({
    queryKey: ["search-trending"],
    queryFn: () => getTrendingSearches(),
    enabled: open,
    staleTime: 60_000,
  });

  function goToSearchPage(term?: string) {
    const value = (term ?? query).trim();
    if (!value) return;
    setOpen(false);
    router.push(`/recherche?q=${encodeURIComponent(value)}`);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    goToSearchPage();
  }

  function handleSelectProduct(slug: string) {
    setOpen(false);
    router.push(`/produits/${slug}`);
  }

  return (
    <>
      <Button variant="ghost" size="icon" aria-label={t("trigger")} onClick={() => setOpen(true)}>
        <Search className="size-5" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("dialogTitle")}
        description={t("dialogDescription")}
      >
        <form onSubmit={handleSubmit}>
          <CommandInput placeholder={t("placeholder")} value={query} onValueChange={setQuery} />
        </form>
        <CommandList>
          {query.trim().length < 2 && trending.length > 0 && (
            <CommandGroup heading={t("trending")}>
              {trending.map((term) => (
                <CommandItem
                  key={term}
                  value={term}
                  onSelect={() => goToSearchPage(term)}
                  className="gap-2"
                >
                  <TrendingUp className="text-muted-foreground size-3.5" />
                  {term}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {query.trim().length < 2 && trending.length === 0 && (
            <CommandEmpty>{t("minChars")}</CommandEmpty>
          )}
          {query.trim().length >= 2 && !isFetching && results.length === 0 && (
            <CommandEmpty>{t("noResults", { query })}</CommandEmpty>
          )}
          {results.length > 0 && (
            <CommandGroup heading={t("products")}>
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelectProduct(product.slug)}
                  className="gap-3"
                >
                  <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded">
                    <Image
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatPrice(product.price, locale)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {query.trim().length >= 2 && (
            <CommandGroup>
              <CommandItem
                onSelect={() => goToSearchPage()}
                className="text-muted-foreground text-sm"
              >
                {t("viewAllResults", { query })}
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
