import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    name: "Léa M.",
    rating: 5,
    quote:
      "Qualité au rendez-vous et livraison ultra rapide. Les sneakers sont identiques aux photos, je recommande sans hésiter.",
  },
  {
    name: "Karim B.",
    rating: 5,
    quote:
      "Enfin une boutique streetwear avec des prix honnêtes. Le hoodie essential est devenu mon préféré cet hiver.",
  },
  {
    name: "Sofia T.",
    rating: 4,
    quote:
      "Service client réactif pour un échange de taille. Site fluide et agréable à utiliser, une belle découverte.",
  },
];

export function TestimonialsSection() {
  const t = useTranslations("home");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">{t("testimonialsTitle")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <Card key={testimonial.name} className="bg-muted/40 border-none shadow-none">
            <CardContent className="pt-2">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < testimonial.rating
                        ? "fill-brand text-brand"
                        : "text-muted-foreground fill-transparent"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm">&laquo; {testimonial.quote} &raquo;</p>
              <p className="text-muted-foreground mt-4 text-sm font-medium">{testimonial.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
