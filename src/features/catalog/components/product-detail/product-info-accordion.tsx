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
  return (
    <Accordion type="single" collapsible defaultValue="description" className="w-full">
      <AccordionItem value="description">
        <AccordionTrigger>Description</AccordionTrigger>
        <AccordionContent>{description}</AccordionContent>
      </AccordionItem>

      <AccordionItem value="characteristics">
        <AccordionTrigger>Caractéristiques</AccordionTrigger>
        <AccordionContent className="space-y-1">
          {materials && <p>Matières : {materials}</p>}
          {careInstructions && <p>Entretien : {careInstructions}</p>}
          {!materials && !careInstructions && <p>Informations non renseignées pour ce produit.</p>}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="delivery">
        <AccordionTrigger>Livraison</AccordionTrigger>
        <AccordionContent>
          Livraison standard sous 3 à 5 jours ouvrés. Livraison gratuite dès 50€ d&apos;achat.
          Livraison express disponible au checkout.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="returns">
        <AccordionTrigger>Retours</AccordionTrigger>
        <AccordionContent>
          Retours et échanges gratuits sous 30 jours. L&apos;article doit être renvoyé non porté,
          dans son emballage d&apos;origine.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="faq">
        <AccordionTrigger>Questions fréquentes</AccordionTrigger>
        <AccordionContent className="space-y-3">
          <div>
            <p className="font-medium">Comment choisir ma taille ?</p>
            <p className="text-muted-foreground">
              Consultez notre guide des tailles ou contactez notre service client pour être
              conseillé·e.
            </p>
          </div>
          <div>
            <p className="font-medium">Puis-je suivre ma commande ?</p>
            <p className="text-muted-foreground">
              Oui, un lien de suivi vous est envoyé par e-mail dès l&apos;expédition.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
