import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  UtensilsCrossed,
  Info,
  MapPin,
  ShoppingBag,
  User,
  Shield,
  LogOut,
  Package,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/fb-img-1781243515658.jpg.asset.json";

const mainLinks = [
  { title: "Home", url: "/", icon: Home },
  { title: "Menu", url: "/menu", icon: UtensilsCrossed },
  { title: "About Us", url: "/about", icon: Info },
  { title: "Visit Us", url: "/visit", icon: MapPin },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" side="left" variant="inset">
      <SidebarHeader className="p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl p-1 transition-colors hover:bg-sidebar-accent/50"
        >
          <img
            src={logo.url}
            alt="Elclassico"
            width={36}
            height={36}
            className="h-8 w-8 rounded-full object-cover ring-1 ring-sidebar-border"
          />
          {!collapsed && (
            <span className="font-display text-lg tracking-wide text-sidebar-foreground">
              Elclassico
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/cart")}>
                  <Link to="/cart" className="flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Cart</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/my-orders")}>
                      <Link to="/my-orders" className="flex items-center gap-3">
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive("/admin")}>
                        <Link to="/admin" className="flex items-center gap-3">
                          <Shield className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={signOut}
                      className="flex items-center gap-3 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/auth")}>
                    <Link to="/auth" className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <p className="text-[10px] text-sidebar-foreground/50 leading-tight">
            &copy; {new Date().getFullYear()} Elclassico. All rights reserved.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
