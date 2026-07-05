import { NewsletterForm } from "@/features/home/components/newsletter-form";

export function NewsletterSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-muted/40 flex flex-col items-center rounded-2xl px-6 py-16 text-center">
        <h2 className="font-heading max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
          -10% sur votre première commande
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md text-sm">
          Inscrivez-vous à la newsletter pour recevoir votre code de bienvenue ainsi que nos
          nouveautés en avant-première.
        </p>
        <div className="mt-6 flex justify-center">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
