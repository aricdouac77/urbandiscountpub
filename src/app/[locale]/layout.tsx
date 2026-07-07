import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { safeJsonLd } from "@/lib/json-ld";
import "../globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const siteCopy = {
  fr: {
    title: "UrbanDiscount — Sneakers & streetwear premium à prix discount",
    description:
      "Sneakers, streetwear et accessoires premium sélectionnés pour leur qualité, à prix discount. Livraison rapide, retours gratuits sous 30 jours.",
    ogLocale: "fr_FR",
  },
  en: {
    title: "UrbanDiscount — Premium sneakers & streetwear at discount prices",
    description:
      "Premium sneakers, streetwear and accessories selected for their quality, at discount prices. Fast shipping, free returns within 30 days.",
    ogLocale: "en_US",
  },
} as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = hasLocale(routing.locales, locale) ? siteCopy[locale] : siteCopy[routing.defaultLocale];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: copy.title,
      template: "%s | UrbanDiscount",
    },
    description: copy.description,
    openGraph: {
      type: "website",
      locale: copy.ogLocale,
      siteName: "UrbanDiscount",
      title: copy.title,
      description: copy.description,
      url: `${baseUrl}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: "UrbanDiscount",
      description: copy.description,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UrbanDiscount",
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "UrbanDiscount",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/${locale}/${locale === "fr" ? "recherche" : "search"}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }}
        />
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
