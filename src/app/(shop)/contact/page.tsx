import type { Metadata } from "next";
import { ContactForm } from "@/features/contact/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez le service client UrbanDiscount.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Une question sur votre commande, un produit ou notre service ? Écrivez-nous.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
