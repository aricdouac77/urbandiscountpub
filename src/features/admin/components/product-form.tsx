"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadButton } from "@/features/admin/components/image-upload-button";
import { createProduct, updateProduct } from "@/actions/admin/product.actions";
import {
  productSchema,
  type ProductFormValues,
  type ProductInput,
} from "@/features/admin/schemas/product.schema";

type ProductFormProps = {
  productId?: string;
  defaultValues: ProductFormValues;
  categories: { id: string; name: string }[];
  collections: { id: string; name: string }[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  productId,
  defaultValues,
  categories,
  collections,
}: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues, unknown, ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const variantFields = useFieldArray({ control: form.control, name: "variants" });
  const imageFields = useFieldArray({ control: form.control, name: "images" });

  async function onSubmit(values: ProductInput) {
    setIsSubmitting(true);
    const result = productId ? await updateProduct(productId, values) : await createProduct(values);
    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(productId ? "Produit mis à jour" : "Produit créé");
    router.push("/admin/produits");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!productId) {
                          form.setValue("slug", slugify(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description courte</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="ACTIVE">Actif</SelectItem>
                        <SelectItem value="ARCHIVED">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} value={field.value as number} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix barré (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={(field.value as number | null) ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Aucune catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="mb-2 text-sm font-medium">Collections</p>
              <div className="flex flex-wrap gap-4">
                {collections.map((collection) => (
                  <FormField
                    key={collection.id}
                    control={form.control}
                    name="collectionIds"
                    render={({ field }) => {
                      const checked = field.value?.includes(collection.id);
                      return (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                field.onChange(
                                  value
                                    ? [...(field.value ?? []), collection.id]
                                    : (field.value ?? []).filter((id) => id !== collection.id),
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{collection.name}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Mis en avant</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isBestSeller"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Meilleure vente</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isNewArrival"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Nouveauté</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Caractéristiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matières</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="careInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entretien</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL vidéo (optionnel)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Variantes</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                variantFields.append({ sku: "", size: "", stock: 0, isDefault: false })
              }
            >
              <Plus className="size-4" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {variantFields.fields.map((variantField, index) => (
              <div
                key={variantField.id}
                className="grid grid-cols-12 items-end gap-3 border-b pb-4"
              >
                <FormField
                  control={form.control}
                  name={`variants.${index}.sku`}
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`variants.${index}.size`}
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Taille</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`variants.${index}.stock`}
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value as number} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="col-span-2"
                  onClick={() => variantFields.remove(index)}
                  aria-label="Supprimer la variante"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {form.formState.errors.variants?.root && (
              <p className="text-destructive text-sm">
                {form.formState.errors.variants.root.message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Images</CardTitle>
            <div className="flex items-center gap-2">
              <ImageUploadButton
                onUploaded={(url) => imageFields.append({ url, alt: "" })}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => imageFields.append({ url: "", alt: "" })}
              >
                <Plus className="size-4" />
                Ajouter un lien
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {imageFields.fields.map((imageField, index) => (
              <div key={imageField.id} className="grid grid-cols-12 items-end gap-3 border-b pb-4">
                <FormField
                  control={form.control}
                  name={`images.${index}.url`}
                  render={({ field }) => (
                    <FormItem className="col-span-7">
                      <FormLabel>URL de l&apos;image</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`images.${index}.alt`}
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Texte alternatif</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="col-span-2"
                  onClick={() => imageFields.remove(index)}
                  aria-label="Supprimer l'image"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : productId ? "Mettre à jour" : "Créer le produit"}
        </Button>
      </form>
    </Form>
  );
}
