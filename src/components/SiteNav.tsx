import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/fb-img-1781243515658.jpg.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About Us" },
  { to: "/visit", label: "Visit Us" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          scrolled ? "" : ""
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-soft" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo.url}
              alt="Elclassico"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-border transition-transform duration-500 group-hover:rotate-12"
            />
            <span className="font-display text-xl tracking-wide text-foreground">
              Elclassico
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
                  activeProps={{ className: "text-foreground after:w-full" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Link
              to="/menu"
              className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-soft transition-all hover:bg-foreground/90 hover:shadow-gold hover:-translate-y-0.5"
            >
              Order Now
            </Link>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-foreground"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass rounded-3xl p-6 shadow-lift animate-fade-in">
            <ul className="flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block text-lg font-display text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/menu"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background"
                >
                  Order Now
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}