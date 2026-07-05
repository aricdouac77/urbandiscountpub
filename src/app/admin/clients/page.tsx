import type { Metadata } from "next";
import Link from "next/link";
import { getUsersAdmin } from "@/actions/admin/user.actions";
import { UserRoleSelect } from "@/features/admin/components/user-role-select";
import { ListingPagination } from "@/features/catalog/components/listing/listing-pagination";

export const metadata: Metadata = {
  title: "Clients | Administration",
};

type ClientsAdminPageProps = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function ClientsAdminPage({ searchParams }: ClientsAdminPageProps) {
  const { page: pageParam, q } = await searchParams;
  const page = Number(pageParam) || 1;
  const { users, totalPages } = await getUsersAdmin(page, q ?? "");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Clients &amp; utilisateurs</h1>

      <form className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher par nom ou e-mail..."
          className="border-input bg-background flex h-9 w-full max-w-sm rounded-md border px-3 py-1 text-sm shadow-xs"
        />
      </form>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Nom</th>
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 text-right font-medium">Commandes</th>
              <th className="px-4 py-2 font-medium">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${user.id}`} className="font-medium hover:underline">
                    {user.name}
                  </Link>
                </td>
                <td className="text-muted-foreground px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 text-right">{user._count.orders}</td>
                <td className="px-4 py-3">
                  <UserRoleSelect userId={user.id} role={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ListingPagination
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/admin/clients?q=${encodeURIComponent(q ?? "")}&page=${p}`}
      />
    </div>
  );
}
