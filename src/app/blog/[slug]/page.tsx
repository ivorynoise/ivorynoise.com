import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NewsletterForm } from "@/components/NewsletterForm";

import { BlogPostMarkdown } from "@/components/blog/BlogPostMarkdown";
import { BlogPostToc } from "@/components/blog/BlogPostToc";
import { extractTocFromMarkdown } from "@/lib/markdown-toc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

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
  if (outbound) redirect(outbound);

  const toc = extractTocFromMarkdown(post.content);

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="blog-article">
      <div
        className="site-container"
        style={{
          paddingTop: "clamp(2.5rem, 5vw, 4rem)",
          paddingBottom: "clamp(4rem, 8vw, 6rem)",
        }}
      >
        {/* Constrain to comfortable reading width */}
        <div style={{ maxWidth: "42rem", marginInline: "auto" }}>
          {/* Back link */}
          <Link href="/blog" className="blog-post-back">
            ← All posts
          </Link>

          {/* Article header */}
          <header className="blog-post-header">
            <h1 className="blog-post-title">{post.title}</h1>

            <div className="blog-post-meta">
              <time dateTime={post.publishedAt}>{date}</time>
              {post.estimatedReadingTime ? (
                <span>{post.estimatedReadingTime} min read</span>
              ) : null}
            </div>
          </header>

          {/* Inline TOC — only on mobile, only if the post has sections */}
          {toc.length > 0 && <BlogPostToc items={toc} variant="mobile" />}

          {/* Content */}
          <BlogPostMarkdown content={post.content} />

          {/* Newsletter signup */}
          <div className="mt-16 border-t border-nocturne/[0.1] pt-10">
            <h2 className="blog-post-cta-title">Enjoyed this post?</h2>
            <p
              className="mb-6 text-nocturne/55"
              style={{ fontSize: "var(--text-sm)" }}
            >
              Subscribe for more posts on engineering, systems, and building.
            </p>
            <NewsletterForm />
          </div>

          {/* Tags — at the bottom, plain and unobtrusive */}
          {post.tags && post.tags.length > 0 && (
            <footer className="blog-post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-post-tag">
                  {tag}
                </span>
              ))}
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
