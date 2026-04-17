import { site } from "@/lib/site";
import { SocialLinks } from "@/components/SocialLinks";

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
        className="site-container"
        style={{
          paddingBlock: "1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-cream/50" style={{ fontSize: "var(--text-sm)" }}>
            © {year} {site.name}
          </p>
          <SocialLinks iconsOnly onDark />
        </div>
      </div>
    </footer>
  );
}
