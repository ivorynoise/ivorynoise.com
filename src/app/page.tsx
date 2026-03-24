import Image from "next/image";
import { Server, Database, Users, Rocket } from "lucide-react";
import { TrackedLink } from "@/components/TrackedLink";

import deepakPhoto from "../../public/images/deepak.jpg";

const expertise = [
  {
    Icon: Server,
    title: "Systems Architecture",
    body: "Designing distributed backends, API platforms, and infrastructure that scales without accumulating debt.",
  },
  {
    Icon: Database,
    title: "Developer Tooling",
    body: "Building internal tools and developer infrastructure that remove daily friction and let teams ship faster.",
  },
  {
    Icon: Users,
    title: "Engineering Leadership",
    body: "Scaling teams from 0 to 1 — hiring, culture, shipping cadence, and the hard conversations nobody warns you about.",
  },
];

export default function AboutPage() {
  return (
    <>
      
      <section className="py-16 lg:py-28">
        <div className="site-container grid items-center gap-16 lg:grid-cols-[1fr_0.55fr]">
          <div>
            <h1
              className="text-nocturne leading-[1.12]"
              style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-hero)", fontWeight: 600 }}
            >
              Hey, I&apos;m Deepak
            </h1>
            <p
              className="mt-3 text-nocturne/50"
              style={{ fontSize: "var(--text-lead)", lineHeight: 1.7 }}
            >
              engineering, systems, and startups. always building.
            </p>

            <p
              className="mt-8 text-nocturne/70"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.9, maxWidth: "34rem" }}
            >
              I am a software engineer and technical leader with a deep focus on
              systems architecture, developer tooling, and building products from
              scratch. Currently, I am the Cofounder &amp; CTO of{" "}
              <strong className="text-nocturne font-semibold">Synthlane Technologies</strong>,
              where we are building infrastructure that helps engineering teams
              ship faster without compromising on reliability.
            </p>

            <div className="mt-8 flex gap-4">
              <TrackedLink
                href="/blog"
                event="cta_clicked"
                properties={{ label: "Read my writing", location: "hero" }}
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold text-cream transition-opacity hover:opacity-85"
                style={{ background: "var(--color-nocturne)" }}
              >
                Read my writing
              </TrackedLink>
              <TrackedLink
                href="mailto:deepak@synthlane.com"
                event="cta_clicked"
                properties={{ label: "Say hello", location: "hero" }}
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold text-nocturne/70 transition-colors hover:text-nocturne"
                style={{ border: "var(--border)" }}
              >
                Say hello
              </TrackedLink>
            </div>
          </div>

          <div className="relative">
            <div
              className="overflow-hidden"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)" }}
            >
              <Image
                src={deepakPhoto}
                alt="Deepak Aggarwal"
                width={420}
                height={520}
                priority
                className="w-full object-cover"
                style={{ aspectRatio: "4/5" }}
              />
            </div>
            <div
              className="absolute -z-10"
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: "var(--color-forest)",
                opacity: 0.07,
                top: "-2rem",
                right: "-2rem",
              }}
            />
          </div>
        </div>
      </section>

      
      <section
        style={{
          paddingBlock: "var(--section-py)",
          background: "var(--color-sand)",
        }}
      >
        <div className="site-container grid gap-14 lg:grid-cols-2" style={{ maxWidth: "60rem" }}>
          <div>
            <h2
              className="text-nocturne mb-6"
              style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-display)", fontWeight: 600 }}
            >
              Background
            </h2>
            <p
              className="text-nocturne/70"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.9 }}
            >
              Before Synthlane, I spent years in backend engineering — designing
              distributed systems, building APIs that serve millions of requests,
              and leading engineering teams through the messy process of scaling
              from zero to one. I have held both IC and leadership roles, and
              I&apos;ve found that the best engineering leaders never stop
              writing code.
            </p>
            <p
              className="mt-6 text-nocturne/70"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.9 }}
            >
              My areas of interest include platform engineering, API design,
              database internals, and the organizational problems that show up
              when you try to scale a team alongside a codebase. I think most
              technical debt is actually decision debt — the cost of choices
              nobody wrote down.
            </p>
          </div>
          <div>
            <h2
              className="text-nocturne mb-6"
              style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-display)", fontWeight: 600 }}
            >
              Philosophy
            </h2>
            <p
              className="text-nocturne/70"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.9 }}
            >
              I believe small teams beat large ones almost every time. That the
              best code is the code you don&apos;t write. That most meetings are
              a symptom of unclear thinking — and if you need a meeting to
              decide something, you probably don&apos;t understand the problem yet.
            </p>
            <p
              className="mt-6 text-nocturne/70"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.9 }}
            >
              I write about the things I learn while building — systems design,
              technical leadership, and the decisions that compound over time.
              Not advice. Just notes from the field.
            </p>
          </div>
        </div>
      </section>

      
      <section style={{ paddingBlock: "var(--section-py)" }}>
        <div className="site-container">
          <div className="grid gap-6 lg:grid-cols-2 mb-14">
            <h2
              className="text-nocturne"
              style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-display)", fontWeight: 600 }}
            >
              Core<br />Expertise
            </h2>
            <p
              className="text-nocturne/55 self-end"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.75 }}
            >
              A focused toolkit built through years of shipping products,
              scaling teams, and learning what actually matters at each stage.
            </p>
          </div>

          <div className="grid sm:grid-cols-3">
            {expertise.map(({ Icon, title, body }, i) => (
              <div
                key={title}
                className="p-8"
                style={{
                  borderLeft: i > 0 ? "var(--border)" : "none",
                  borderTop: "var(--border)",
                  borderBottom: "var(--border)",
                }}
              >
                <Icon
                  className="mb-6"
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    color: "var(--color-mauve)",
                    strokeWidth: 1.4,
                  }}
                />
                <h3
                  className="text-nocturne font-semibold mb-3"
                  style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-title)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-nocturne/60"
                  style={{ fontSize: "var(--text-sm)", lineHeight: 1.8 }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section
        style={{
          background: "var(--color-nocturne)",
          color: "var(--color-cream)",
          paddingBlock: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        <div className="site-container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-cream/55 mb-1" style={{ fontSize: "var(--text-sm)" }}>
              Open to conversations
            </p>
            <p
              className="text-cream leading-tight"
              style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-title)", fontWeight: 600 }}
            >
              Building something interesting? Let&apos;s talk.
            </p>
          </div>
          <TrackedLink
            href="mailto:deepak@synthlane.com"
            event="cta_clicked"
            properties={{ label: "Get in touch", location: "contact_banner" }}
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] text-nocturne font-semibold px-6 py-3 text-sm transition-opacity hover:opacity-85 shrink-0"
            style={{ background: "var(--color-cream)" }}
          >
            Get in touch
          </TrackedLink>
        </div>
      </section>
    </>
  );
}

