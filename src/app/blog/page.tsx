import { getAllPosts } from "@/lib/posts";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { ArchiveRow } from "@/components/BlogCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing | Ivory Noise",
  description: "Notes on design, systems, and building things that work.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const pinned = posts.filter((p) => p.pinned);
  const archive = posts.filter((p) => !p.pinned);

  return (
    <>
      
      <section style={{ paddingTop: "var(--section-py)", paddingBottom: "3rem" }}>
        <div className="site-container" style={{ maxWidth: "52rem" }}>
          <p className="text-label text-nocturne/50 mb-8">Writing</p>
          <h1
            className="text-nocturne leading-[1.08]"
            style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-hero)", fontWeight: 600 }}
          >
            Notes & essays
          </h1>
          <p
            className="mt-6 text-nocturne/65"
            style={{ fontSize: "var(--text-lead)", lineHeight: 1.8, maxWidth: "30rem" }}
          >
            On design systems, product thinking, and the details that matter.
          </p>
        </div>
      </section>

      
      {pinned.length > 0 && (
        <section style={{ paddingBottom: "var(--section-py)" }}>
          <div className="site-container">
            <div
              className="mb-10"
              style={{ borderTop: "var(--border)", paddingTop: "2rem" }}
            >
              <p className="text-label text-nocturne/40">Featured</p>
            </div>
            <FeaturedCarousel posts={pinned} />
          </div>
        </section>
      )}

      
      {archive.length > 0 && (
        <section style={{ paddingBlock: "var(--section-py)", borderTop: "var(--border)" }}>
          <div className="site-container">
            <div className="grid gap-0 lg:grid-cols-[13rem_1fr]">
              <div className="mb-10 lg:mb-0">
                <p className="text-label text-nocturne/50">All posts</p>
              </div>

              
              <div>
                {archive.map((post) => (
                  <ArchiveRow key={post.slug} post={post} />
                ))}

                <div
                  className="mt-12"
                  style={{ borderTop: "var(--border)", paddingTop: "2rem" }}
                >
                  <a
                    href="/rss.xml"
                    className="text-label text-nocturne/50 transition-colors hover:text-nocturne"
                  >
                    RSS Feed →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      
      {posts.length === 0 && (
        <section style={{ paddingBlock: "var(--section-py)" }}>
          <div className="site-container">
            <p className="text-nocturne/60" style={{ fontSize: "var(--text-body)" }}>
              No posts yet — check back soon.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
