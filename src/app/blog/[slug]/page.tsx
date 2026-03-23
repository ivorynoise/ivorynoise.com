import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Ivory Noise`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      
      <section style={{ paddingTop: "var(--section-py)", paddingBottom: "2.5rem" }}>
        <div className="site-container" style={{ maxWidth: "52rem" }}>
          <Link
            href="/blog"
            className="text-label text-nocturne/55 hover:text-nocturne transition-colors mb-8 inline-block"
          >
            ← Back to writing
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5 text-nocturne/55" style={{ fontSize: "var(--text-sm)" }}>
            <time dateTime={post.publishedAt}>{date}</time>
            {post.estimatedReadingTime && (
              <span>{post.estimatedReadingTime} min read</span>
            )}
          </div>

          <h1
            className="text-nocturne italic leading-[1.06]"
            style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-hero)", fontWeight: 600 }}
          >
            {post.title}
          </h1>

          {post.description && (
            <p
              className="mt-5 text-nocturne/55"
              style={{ fontSize: "var(--text-lead)", lineHeight: 1.75, maxWidth: "40rem" }}
            >
              {post.description}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-nocturne/50 uppercase tracking-wider"
                  style={{
                    border: "var(--border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.65rem",
                    padding: "2px 8px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      
      <div className="site-container" style={{ maxWidth: "52rem" }}>
        <hr style={{ borderColor: "var(--color-sand)" }} />
      </div>

      
      <article style={{ paddingBlock: "var(--section-py)" }}>
        <div className="site-container prose-content" style={{ maxWidth: "52rem" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="table-wrapper">
                  <table>{children}</table>
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      
      <div
        className="site-container"
        style={{ maxWidth: "52rem", paddingBottom: "var(--section-py)", borderTop: "var(--border)", paddingTop: "2rem" }}
      >
        <Link
          href="/blog"
          className="text-label text-nocturne/55 hover:text-nocturne transition-colors"
          style={{ borderBottom: "1px solid currentColor", paddingBottom: "2px" }}
        >
          ← Back to writing
        </Link>
      </div>
    </>
  );
}
