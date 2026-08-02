import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getPost, blogPosts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    const url = `https://elclassico-com.lovable.app/blog/${params.slug}`;
    if (!loaderData) return { meta: [{ title: "Article — Elclassico" }] };
    return {
      meta: [
        { title: `${loaderData.title} — Elclassico` },
        { name: "description", content: loaderData.description },
        { name: "keywords", content: loaderData.keywords },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: loaderData.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: loaderData.cover },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.title,
            description: loaderData.description,
            image: loaderData.cover,
            datePublished: loaderData.date,
            author: { "@type": "Organization", name: "Elclassico" },
            publisher: { "@type": "Organization", name: "Elclassico" },
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const others = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteNav />
      <article className="pt-36 pb-16">
        <div className="mx-auto max-w-3xl px-6">
          <Link to="/blog" className="text-xs uppercase tracking-[0.3em] text-gold">
            ← Blog
          </Link>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl leading-tight">{post.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })} ·{" "}
            {post.readMinutes} min read
          </p>
          <img
            src={post.cover}
            alt={post.title}
            className="mt-8 w-full rounded-3xl object-cover aspect-[16/9] shadow-lift"
          />
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{post.intro}</p>

          {post.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="font-display text-2xl sm:text-3xl">{s.heading}</h2>
              {s.body.map((b, i) => (
                <p key={i} className="mt-3 leading-relaxed text-muted-foreground">
                  {b}
                </p>
              ))}
            </section>
          ))}

          <div className="mt-14 rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
            <h2 className="font-display text-2xl">Hungry after all that reading?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Order fresh from our kitchen — delivered hot.</p>
            <Link
              to="/menu"
              className="mt-5 inline-block rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background"
            >
              View the menu
            </Link>
          </div>

          {others.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl">Keep reading</h2>
              <ul className="mt-4 space-y-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: o.slug }}
                      className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {o.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}