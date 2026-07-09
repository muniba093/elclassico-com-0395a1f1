import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listUsersWithRoles, setUserAdmin } from "@/lib/api/admin-users.functions";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const qc = useQueryClient();
  const fetchUsers = useServerFn(listUsersWithRoles);
  const toggleAdmin = useServerFn(setUserAdmin);

  const q = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchUsers({ data: undefined as never }),
  });

  async function toggle(userId: string, isAdmin: boolean) {
    try {
      await toggleAdmin({ data: { userId, makeAdmin: !isAdmin } });
      toast.success(isAdmin ? "Admin role removed" : "User promoted to admin");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left px-4 py-3">Name</th>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">Joined</th>
            <th className="text-left px-4 py-3">Role</th>
            <th className="text-left px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {q.isLoading && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>}
          {q.data?.map((u) => {
            const isAdmin = u.roles.includes("admin");
            return (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-3">{u.full_name || "—"}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isAdmin ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"}`}>
                    {isAdmin ? "Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(u.id, isAdmin)} className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted">
                    {isAdmin ? "Remove admin" : "Make admin"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}