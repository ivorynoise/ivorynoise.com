import Image from "next/image";
// import Link from "next/link";

// import { getPostHref, isExternalPost } from "@/lib/post-links";
// import { getAllPosts } from "@/lib/posts";
// import { readingItems } from "@/data/reading";
import { inlineLinkClass } from "@/lib/inline-link";
import { site } from "@/lib/site";

import deepakPhoto from "../../public/images/deepak.jpg";

// const RECENT_POSTS = 5;
// const RECENT_READING = 5;

const highlights = [
  "Backend and distributed systems engineer with 9+ years of experience, now focused on building the infrastructure layer that makes AI systems production-ready at scale.",
  "Started in high-stakes financial data systems, scaled through Meta's distributed infrastructure processing 100M+ events/day, then founded and led engineering teams building crypto and AI-first products.",
  "Brings a rare combination of deep backend engineering, founding-level ownership, and hands-on AI infra experience spanning LLM observability, evaluation pipelines, and voice agent orchestration.",
  "Proven track record leading and mentoring engineers across founding and growth-stage environments, driving architecture decisions from zero to production.",
  "Experience across Meta, Y-Combinator startups, and self-founded ventures across the US, UK, and India.",
] as const;

// function formatListDate(dateStr: string) {
//   return new Date(dateStr).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

export default function HomePage() {
  // const posts = getAllPosts().slice(0, RECENT_POSTS);
  // const reading = readingItems.slice(0, RECENT_READING);

  return (
    <>
      <section className="py-9 lg:py-12">
        <div className="site-container grid max-w-[70rem] items-start gap-8 sm:gap-10 lg:grid-cols-[1fr_min(36%,400px)] lg:gap-12 lg:items-stretch">
          <div className="min-w-0">
            <h1
              className="text-balance font-semibold leading-[1.08] tracking-tight text-nocturne"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.4rem, 3.2vw, 1.9rem)",
              }}
            >
              Hey, I am {site.name.split(" ")[0]}
            </h1>
            <p
              className="mt-2 max-w-[40rem] italic leading-snug text-[#b04a37]"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(0.8rem, 1.15vw, 0.92rem)",
              }}
            >
              Agentic AI, system architecture, and scalable apps — always
              building.
            </p>

            <div className="font-sans mt-5 max-w-[40rem] space-y-3 text-pretty">
              <p>
                I am a full stack software engineer and engineering leader
                passionate about Agentic AI, system architecture, and scalable
                apps. Currently, I am a Senior Software Engineer at{" "}
                <strong className="font-semibold text-nocturne">
                  Reinforcelabs.ai
                </strong>
                , working at the intersection of security and AI. Previously, I
                was head of engineering at{" "}
                <strong className="font-semibold text-nocturne">
                  Authlayer
                </strong>
                , where I worked on building{" "}
                <a
                  href="https://www.finlens.app/"
                  className={inlineLinkClass}
                  rel="noopener noreferrer"
                >
                  Finlens
                </a>{" "}
                and ZeFi. I previously worked with{" "}
                <strong className="font-semibold text-nocturne">
                  Facebook
                </strong>
                , London, on the Portal Release Infrastructure Team.
              </p>
              <p>
                My areas of interest include agentic AI and distributed systems.
              </p>
              <p>
                In 2024, I took a leap of faith and co-founded{" "}
                <strong className="font-semibold text-nocturne">
                  Browmath Capital
                </strong>
                . I was part of the{" "}
                <strong className="font-semibold text-nocturne">
                  Meta Platform Engineering
                </strong>{" "}
                team, where I worked on platform reliability, distributed
                infrastructure, and release systems at scale.
              </p>
            </div>

            <div className="mt-7 border-t border-nocturne/[0.09] pt-6">
              <p className="text-label mb-3 text-nocturne/40">At a glance</p>
              <ul className="max-w-[40rem] list-disc space-y-1.5 pl-4 text-pretty marker:text-nocturne/28">
                {highlights.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center lg:block lg:justify-end">
            <div className="relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-none lg:sticky lg:top-[4.75rem] lg:self-start">
              <div
                className="overflow-hidden bg-sand/50 ring-1 ring-nocturne/[0.06]"
                style={{
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <Image
                  src={deepakPhoto}
                  alt={site.name}
                  width={420}
                  height={520}
                  priority
                  className="aspect-[4/5] w-full object-cover object-[center_12%]"
                  sizes="(max-width: 1024px) 280px, 400px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent blog posts + reading section — temporarily hidden
      <section
        className="border-t border-nocturne/[0.08]"
        style={{
          paddingBlock: "clamp(2rem, 4vw, 2.75rem)",
          background: "var(--color-sand)",
        }}
      >
        <div className="site-container grid max-w-[70rem] gap-9 sm:gap-10 lg:grid-cols-2">
          <div>
            <h2
              className="font-semibold leading-snug text-nocturne"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(0.98rem, 1.35vw, 1.12rem)",
              }}
            >
              Recent blog posts ·{" "}
              <Link href="/blog" className={inlineLinkClass}>
                Full archive →
              </Link>
            </h2>
            <p className="mt-1.5 font-sans text-nocturne/52 text-sm">
              Things I have written recently.
            </p>
            <ul className="mt-4 list-disc space-y-[0.35rem] pl-4 marker:text-nocturne/25">
              {posts.map((post) => {
                const href = getPostHref(post);
                const ext = isExternalPost(post);
                const date = formatListDate(post.publishedAt);
                return (
                  <li key={post.slug} className="font-sans text-pretty text-nocturne">
                    <time
                      className="font-mono text-[0.8125rem] tabular-nums text-nocturne/48"
                      dateTime={post.publishedAt}
                    >
                      {date}
                    </time>
                    <span className="text-nocturne/30">{` : `}</span>
                    {ext ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
                        {post.title}
                      </a>
                    ) : (
                      <Link href={href} className={inlineLinkClass}>
                        {post.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2
              className="font-semibold leading-snug text-nocturne"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(0.98rem, 1.35vw, 1.12rem)",
              }}
            >
              Recent reading ·{" "}
              <Link href="/reading" className={inlineLinkClass}>
                Reading list →
              </Link>
            </h2>
            <p className="mt-1.5 font-sans text-nocturne/52 text-sm">
              Papers and posts I am reading or recommend.
            </p>
            <ul className="mt-4 list-disc space-y-[0.35rem] pl-4 marker:text-nocturne/25">
              {reading.map((item) => {
                const meta = [item.author, item.source].filter(Boolean).join(" · ");
                return (
                  <li key={item.url} className="font-sans text-pretty text-nocturne">
                    {item.date ? (
                      <>
                        <time
                          className="font-mono text-[0.8125rem] tabular-nums text-nocturne/48"
                          dateTime={item.date}
                        >
                          {formatListDate(item.date)}
                        </time>
                        <span className="text-nocturne/30">{` : `}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-[0.8125rem] tabular-nums text-nocturne/38">—</span>
                        <span className="text-nocturne/30">{` : `}</span>
                      </>
                    )}
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
                      {item.title}
                    </a>
                    {meta ? <span className="text-nocturne/45">{` · ${meta}`}</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
      */}
    </>
  );
}
