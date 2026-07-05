import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_SECTIONS } from "@/features/content/data/faq";

export const metadata: Metadata = {
  title: "Foire aux questions",
  description:
    "Toutes les réponses à vos questions sur les commandes, la livraison, les retours et le paiement.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Foire aux questions
      </h1>

      <div className="mt-10 space-y-10">
        {FAQ_SECTIONS.map((section) => (
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
