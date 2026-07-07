import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api"];
  for (const locale of routing.locales) {
    disallow.push(`/${locale}/compte`, `/${locale}/checkout`, `/${locale}/wishlist`);
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
