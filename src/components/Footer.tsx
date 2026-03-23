import Link from "next/link";
import { site } from "@/lib/site";
import { SocialLinks } from "@/components/SocialLinks";
import { NewsletterForm } from "@/components/NewsletterForm";

const footerLinks = [
  { label: "About",   href: "/" },
  { label: "Writing",  href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "RSS",     href: "/rss.xml" },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--color-nocturne)", color: "var(--color-cream)" }}>

      
      <div
        id="newsletter"
        className="site-container"
        style={{ paddingBlock: "var(--section-py)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]" style={{ maxWidth: "48rem" }}>
          <div>
            <h2
              className="text-cream leading-tight"
              style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-title)", fontWeight: 600 }}
            >
              Newsletter
            </h2>
            <p className="mt-3 text-cream/45" style={{ fontSize: "var(--text-sm)", lineHeight: 1.75 }}>
              Occasional notes on design, systems, and things worth reading. No spam.
            </p>
          </div>
          <div className="self-center">
            <NewsletterForm />
          </div>
        </div>
      </div>

      
      <div className="site-container py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <span className="text-cream/35" style={{ fontSize: "var(--text-xs)" }}>
              © {new Date().getFullYear()} {site.name}
            </span>
            <nav className="flex flex-wrap gap-5">
              {footerLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-cream/45 transition-colors hover:text-cream"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <SocialLinks compact onDark />
        </div>
      </div>
    </footer>
  );
}
