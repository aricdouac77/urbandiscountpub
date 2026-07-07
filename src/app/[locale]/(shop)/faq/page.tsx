import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqSections } from "@/features/content/data/faq";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("product");
  const locale = await getLocale();
  return {
    title: t("faqMetaTitle"),
    description: t("faqMetaDescription"),
    alternates: { canonical: `/${locale}/faq` },
  };
}

export default async function FaqPage() {
  const t = await getTranslations("product");
  const locale = (await getLocale()) as Locale;
  const sections = getFaqSections(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("faqMetaTitle")}
      </h1>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
            <Accordion type="single" collapsible>
              {section.items.map((item, index) => (
                <AccordionItem key={index} value={`${section.id}-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}
