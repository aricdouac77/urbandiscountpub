"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CategoryNavData } from "@/features/catalog/queries/get-home-sections";

export function MobileNav({ categories }: { categories: CategoryNavData[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">UrbanDiscount</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              onClick={() => setOpen(false)}
              className="hover:bg-accent rounded-md px-2 py-2.5 text-sm font-medium"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/collections/nouveautes"
            onClick={() => setOpen(false)}
            className="text-brand hover:bg-accent rounded-md px-2 py-2.5 text-sm font-medium"
          >
            Nouveautés
          </Link>
          <div className="bg-border my-2 h-px" />
          <Link
            href="/a-propos"
            onClick={() => setOpen(false)}
            className="hover:bg-accent rounded-md px-2 py-2.5 text-sm"
          >
            À propos
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="hover:bg-accent rounded-md px-2 py-2.5 text-sm"
          >
            Contact
          </Link>
          <Link
            href="/faq"
            onClick={() => setOpen(false)}
            className="hover:bg-accent rounded-md px-2 py-2.5 text-sm"
          >
            FAQ
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
