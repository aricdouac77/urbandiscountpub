import Link from "next/link";
import { requireAdmin } from "@/lib/auth-guards";
import { AdminNav } from "@/features/admin/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="bg-muted/20 min-h-screen">
      <div className="bg-background border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="font-heading text-lg font-semibold">
            UrbanDiscount — Administration
          </Link>
          <Link href="/" className="text-muted-foreground text-sm hover:underline">
            Retour à la boutique
          </Link>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
