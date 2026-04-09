import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { BlogPostMarkdown } from "@/components/blog/BlogPostMarkdown";
import { BlogPostToc } from "@/components/blog/BlogPostToc";
import { extractTocFromMarkdown } from "@/lib/markdown-toc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { inlineLinkClass } from "@/lib/inline-link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ${site.name}`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const outbound = post.externalUrl?.trim();
  if (outbound) {
    redirect(outbound);
  }

  const toc = extractTocFromMarkdown(post.content);

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="blog-article">
      <section style={{ paddingTop: "clamp(2rem, 5vw, 3rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
        <div className="site-container w-full" style={{ maxWidth: "var(--max-w)" }}>
          <div
            className={cn(
              "grid gap-10 lg:gap-12 xl:gap-16",
              toc.length > 0 && "lg:grid-cols-[minmax(0,1fr)_15.75rem]"
            )}
          >
            <div className="min-w-0">
              <Link
                href="/blog"
                className="mb-6 inline-block font-sans text-[0.8125rem] text-nocturne/55 transition-colors hover:text-nocturne"
              >
                ← All posts
              </Link>

              <h1
                className="text-balance font-semibold leading-[1.08] tracking-tight text-nocturne"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.4rem, 3.2vw, 1.9rem)",
                }}
              >
                {post.title}
              </h1>

              <div
                className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-nocturne/48"
                style={{ fontSize: "0.875rem" }}
              >
                <time dateTime={post.publishedAt}>{date}</time>
                {post.estimatedReadingTime ? (
                  <>
                    <span className="text-nocturne/30" aria-hidden>
                      ·
                    </span>
                    <span>{post.estimatedReadingTime} min read</span>
                  </>
                ) : null}
              </div>

              {post.tags && post.tags.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <span
                        className="inline-block rounded-full bg-sand/70 px-3 py-1 font-sans font-medium uppercase tracking-wider text-nocturne/70 dark:bg-sand/55 dark:text-nocturne/65"
                        style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}
                      >
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {post.description ? (
                <p
                  className="mt-6 max-w-[40rem] font-sans text-pretty text-nocturne/70"
                  style={{ fontSize: "0.875rem", lineHeight: 1.58 }}
                >
                  {post.description}
                </p>
              ) : null}

              <BlogPostToc items={toc} variant="mobile" />

              <div className={toc.length === 0 ? "mt-12" : undefined}>
                <BlogPostMarkdown content={post.content} />
              </div>
            </div>

            {toc.length > 0 ? (
              <aside className="relative hidden min-w-0 lg:block">
                <BlogPostToc items={toc} variant="sidebar" />
              </aside>
            ) : null}
          </div>
        </div>
      </section>

      <div
        className="site-container border-t border-nocturne/10"
        style={{
          maxWidth: "var(--max-w)",
          paddingBottom: "var(--section-py)",
          paddingTop: "2rem",
        }}
      >
        <Link href="/blog" className={inlineLinkClass} style={{ fontSize: "var(--text-sm)" }}>
          ← All posts
        </Link>
      </div>
    </div>
  );
}
