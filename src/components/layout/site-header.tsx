import Link from "next/link";
import { getNavCategories } from "@/features/catalog/queries/get-home-sections";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchTrigger } from "@/components/layout/search-trigger";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartButton } from "@/features/cart/components/cart-button";
import { WishlistHeaderButton } from "@/features/wishlist/components/wishlist-header-button";

export async function SiteHeader() {
  const categories = await getNavCategories();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <AnnouncementBar />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <MobileNav categories={categories} />

        <Link href="/" className="font-heading mr-4 text-xl font-semibold tracking-tight">
          UrbanDiscount
        </Link>

        <MainNav categories={categories} />

        <div className="ml-auto flex items-center gap-1">
          <SearchTrigger />
          <ThemeToggle />
          <WishlistHeaderButton />
          <CartButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
