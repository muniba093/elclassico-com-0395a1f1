import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Elclassico" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <SiteNav />
        <div className="pt-40 text-center text-muted-foreground">Checking access…</div>
      </div>
    );
  }

  const tabs = [
    { to: "/admin", label: "Orders" },
    { to: "/admin/menu", label: "Menu" },
    { to: "/admin/categories", label: "Categories" },
    { to: "/admin/promos", label: "Promos" },
    { to: "/admin/settings", label: "Settings" },
    { to: "/admin/users", label: "Users" },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />
      <div className="pt-28 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-display text-4xl">Admin Dashboard</h1>
          <nav className="mt-6 flex gap-2 border-b border-border">
            {tabs.map((t) => {
              const active = pathname === t.to;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}