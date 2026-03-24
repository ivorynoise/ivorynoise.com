"use client";

import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import posthog from "posthog-js";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FeatureCard({ post }: { post: PostMeta }) {
  return (
    <article className="group transition-transform duration-300 hover:-translate-y-1">
      <Link
        href={`/blog/${post.slug}`}
        onClick={() => posthog.capture("blog_post_clicked", { slug: post.slug, title: post.title, card_type: "featured" })}
      >
        <div
          className="w-full mb-4 overflow-hidden"
          style={{ borderRadius: "var(--radius-md)", aspectRatio: "16/10", background: "var(--color-sand)", boxShadow: "var(--shadow-sm)" }}
        >
          {post.coverImage ? (
            
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full" style={{ background: "var(--color-sand)" }} />
          )}
        </div>

        <time
          className="text-nocturne/55"
          dateTime={post.publishedAt}
          style={{ fontSize: "var(--text-sm)" }}
        >
          {formatDate(post.publishedAt)}
        </time>

        <h2
          className="mt-2 text-nocturne font-semibold leading-tight transition-colors group-hover:text-forest"
          style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-title)" }}
        >
          {post.title}
        </h2>

        {post.description && (
          <p
            className="mt-2 text-nocturne/55 line-clamp-2"
            style={{ fontSize: "var(--text-sm)", lineHeight: 1.75 }}
          >
            {post.description}
          </p>
        )}
      </Link>
    </article>
  );
}

export function ArchiveRow({ post }: { post: PostMeta }) {
  return (
    <article
      className="group grid gap-4 py-8"
      style={{
        gridTemplateColumns: "10rem 1fr",
        borderBottom: "var(--border)",
      }}
    >
      <time
        className="text-nocturne/55 pt-0.5"
        dateTime={post.publishedAt}
        style={{ fontSize: "var(--text-sm)", lineHeight: 1.6 }}
      >
        {formatDate(post.publishedAt)}
      </time>

      <div>
        <Link
          href={`/blog/${post.slug}`}
          onClick={() => posthog.capture("blog_post_clicked", { slug: post.slug, title: post.title, card_type: "archive" })}
        >
          <h3
            className="text-nocturne font-semibold leading-tight transition-colors group-hover:text-forest"
            style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-title)" }}
          >
            {post.title}
          </h3>
        </Link>

        {post.description && (
          <p
            className="mt-2 text-nocturne/55 line-clamp-2"
            style={{ fontSize: "var(--text-body)", lineHeight: 1.75 }}
          >
            {post.description}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
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
    </article>
  );
}

export { ArchiveRow as BlogCard };
