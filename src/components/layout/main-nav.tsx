import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CategoryNavData } from "@/features/catalog/queries/get-home-sections";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function MainNav({ categories }: { categories: CategoryNavData[] }) {
  const t = useTranslations("nav");

  return (
    <NavigationMenu className="hidden lg:flex" viewport={false}>
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.id}>
            <NavigationMenuLink asChild>
              <Link href={`/categories/${category.slug}`} className="text-sm font-medium">
                {category.name}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/collections/nouveautes" className="text-brand text-sm font-medium">
              {t("newArrivals")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
