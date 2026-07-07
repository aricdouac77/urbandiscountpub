import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ProductInfoAccordionProps = {
  description: string;
  materials: string | null;
  careInstructions: string | null;
};

export function ProductInfoAccordion({
  description,
  materials,
  careInstructions,
}: ProductInfoAccordionProps) {
  const t = useTranslations("product");

  return (
    <Accordion type="single" collapsible defaultValue="description" className="w-full">
      <AccordionItem value="description">
        <AccordionTrigger>{t("description")}</AccordionTrigger>
        <AccordionContent>{description}</AccordionContent>
      </AccordionItem>

      <AccordionItem value="characteristics">
        <AccordionTrigger>{t("characteristics")}</AccordionTrigger>
        <AccordionContent className="space-y-1">
          {materials && <p>{t("materialsLine", { materials })}</p>}
          {careInstructions && <p>{t("careInstructionsLine", { care: careInstructions })}</p>}
          {!materials && !careInstructions && <p>{t("noInfo")}</p>}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="delivery">
        <AccordionTrigger>{t("delivery")}</AccordionTrigger>
        <AccordionContent>{t("deliveryText")}</AccordionContent>
      </AccordionItem>

      <AccordionItem value="returns">
        <AccordionTrigger>{t("returns")}</AccordionTrigger>
        <AccordionContent>{t("returnsText")}</AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq">
        <AccordionTrigger>{t("faq")}</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div>
            <p className="font-medium">{t("faqSizeQuestion")}</p>
            <p className="text-muted-foreground">{t("faqSizeAnswer")}</p>
          </div>
          <div>
            <p className="font-medium">{t("faqTrackingQuestion")}</p>
            <p className="text-muted-foreground">{t("faqTrackingAnswer")}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
