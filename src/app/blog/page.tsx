import Link from "next/link";
import type { Metadata } from "next";
import { Rss } from "lucide-react";

import { PinnedPostsSection } from "@/components/blog/PinnedPostsSection";
import { inlineLinkClass } from "@/lib/inline-link";
import { getPostHref, isExternalPost } from "@/lib/post-links";
import { getAllPosts, getPinnedPosts, type PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blogs | Deepak Aggarwal",
  description:
    "Technical, non-technical, and financial writing — internal notes and external links.",
};

const MAX_W = "42rem";

function formatListDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function BlogRow({ post }: { post: PostMeta }) {
  const href = getPostHref(post);
  const external = isExternalPost(post);

  return (
    <li className="font-sans text-pretty text-nocturne">
      <time
        className="font-mono text-[0.8125rem] tabular-nums text-nocturne/48"
        dateTime={post.publishedAt}
      >
        {formatListDate(post.publishedAt)}
      </time>
      <span className="text-nocturne/30">{` : `}</span>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={inlineLinkClass}
        >
          {post.title}
        </a>
      ) : (
        <Link href={href} className={inlineLinkClass}>
          {post.title}
        </Link>
      )}
    </li>
  );
}

export default function BlogPage() {
  const posts = getAllPosts();
  const total = posts.length;
  const hasPinned = getPinnedPosts().length > 0;

  return (
    <section style={{ paddingBlock: "clamp(2rem, 5vw, 3.25rem)" }}>
      <div className="site-container w-full">
        <div className="w-full" style={{ maxWidth: MAX_W }}>
          <header>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-6">
              <h1
                className="text-balance font-semibold leading-[1.1] tracking-tight text-nocturne"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.45rem, 3.2vw, 1.95rem)",
                }}
              >
                Blogs
                <span
                  className="font-sans font-normal tabular-nums text-nocturne/45"
                  style={{ fontSize: "clamp(0.9rem, 1.35vw, 1.05rem)" }}
                >
                  {` (${total})`}
                </span>
              </h1>

              <a
                href="/rss.xml"
                className={cn(
                  "inline-flex w-fit shrink-0 items-center gap-2 rounded-md border border-transparent px-3 py-1.5 font-mono text-xs font-medium transition-colors",
                  "bg-[#ffe58f] text-nocturne shadow-[0_1px_0_rgba(44,46,40,0.06)] hover:opacity-95",
                  "dark:border-nocturne/18 dark:bg-sand dark:text-nocturne dark:shadow-none dark:hover:bg-sand/90"
                )}
              >
                Subscribe RSS Feed
                <Rss className="size-3.5 opacity-80" aria-hidden />
              </a>
            </div>

            <div className="mt-5 max-w-none font-sans">
              <p className="text-pretty">
                Notes on engineering, systems, and building — technical,
                non-technical, and financial writing.
              </p>
            </div>

            <hr className="mt-8 border-0 border-t border-nocturne/[0.1]" />
          </header>

          <PinnedPostsSection compact />

          {total > 0 ? (
            <>
              <h2
                id="all-posts-heading"
                className={cn(
                  "text-label text-nocturne/45",
                  hasPinned ? "mt-8" : "mt-6"
                )}
              >
                All posts
              </h2>
              <ul
                className="mt-3 list-disc space-y-[0.35rem] pl-4 marker:text-nocturne/25"
                aria-labelledby="all-posts-heading"
              >
                {posts.map((post) => (
                  <BlogRow key={post.slug} post={post} />
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-8 font-sans text-nocturne/55">
              No posts yet — check back soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
