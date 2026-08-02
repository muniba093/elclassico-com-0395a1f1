import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { blogPosts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Restaurant & Food Business Blog — Elclassico" },
      {
        name: "description",
        content:
          "Guides on starting a restaurant, trending food business ideas, online ordering and restaurant SEO — from the Elclassico kitchen.",
      },
      { property: "og:title", content: "Restaurant & Food Business Blog — Elclassico" },
      { property: "og:description", content: "How to start a restaurant, trending food ideas, and restaurant marketing tips." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://elclassico-com.lovable.app/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://elclassico-com.lovable.app/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Journal</p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl">Food business & restaurant guides.</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Practical, no-fluff articles on starting a restaurant, trending food concepts, online ordering and getting
            found on Google.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {blogPosts.map((p) => (
              <article key={p.slug} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                <Link to="/blog/$slug" params={{ slug: p.slug }}>
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                      {new Date(p.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                      {p.readMinutes} min read
                    </p>
                    <h2 className="mt-2 font-display text-2xl leading-snug">{p.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                    <span className="mt-4 inline-block text-sm font-medium underline-offset-4 group-hover:underline">
                      Read article →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}