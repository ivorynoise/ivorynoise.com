import Link from "next/link";
import { site } from "@/lib/site";
import { SocialLinks } from "@/components/SocialLinks";
import { NewsletterForm } from "@/components/NewsletterForm";

const footerNav = [
  { label: "Blogs", href: "/blog", external: false },
  { label: "Books", href: "/books", external: false },
  {
    label: "Reading",
    href: site.reading.href,
    external: site.reading.external,
  },
  { label: "Contact", href: "mailto:deepak@synthlane.com", external: false },
] as const;

function FooterNavLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external: boolean;
}) {
  const className =
    "text-cream/45 transition-colors hover:text-cream decoration-transparent hover:underline hover:underline-offset-4";
  const style = { fontSize: "var(--text-sm)" as const };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {label}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--palette-nocturne)",
        color: "var(--palette-cream)",
      }}
    >
      <div
        id="newsletter"
        className="site-container"
        style={{
          paddingBlock: "var(--section-py)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="grid gap-10 lg:grid-cols-[1fr_1fr]"
          style={{ maxWidth: "48rem" }}
        >
          <div>
            <h2
              className="text-cream leading-tight"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "var(--text-title)",
                fontWeight: 600,
              }}
            >
              Newsletter
            </h2>
            <p
              className="mt-3 text-cream/45"
              style={{ fontSize: "var(--text-sm)", lineHeight: 1.75 }}
            >
              Weekly essays on real-world system design, distributed systems and
              my opinions on and world life in general.
            </p>
          </div>
          <div className="self-center">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="site-container py-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-12 sm:gap-y-8">
            <div className="flex min-w-0 flex-col gap-5">
              <p
                className="text-cream/90"
                style={{ fontSize: "var(--text-sm)" }}
              >
                © {year} {site.name}
              </p>
              <nav
                className="flex flex-wrap gap-x-6 gap-y-2"
                aria-label="Footer"
              >
                {footerNav.map(({ label, href, external }) => (
                  <FooterNavLink
                    key={label}
                    href={href}
                    label={label}
                    external={external}
                  />
                ))}
              </nav>
            </div>
            <div className="min-w-0 sm:max-w-xl">
              <p className="text-label mb-3 text-cream/40">Social</p>
              <SocialLinks compact onDark />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
