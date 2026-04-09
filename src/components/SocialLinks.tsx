"use client";

import {
  BookOpen,
  Github,
  Instagram,
  Layers,
  Linkedin,
  MessageCircle,
  X,
  Youtube,
} from "lucide-react";
import type { ComponentType } from "react";
import posthog from "posthog-js";

type SocialLink = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

/** Order matches footer spec. Replace Reddit URL if your profile differs. */
const links: SocialLink[] = [
  {
    href: "https://www.youtube.com/@DeepakAggarwal77",
    label: "YouTube",
    icon: Youtube,
  },
  {
    href: "https://x.com/_deepakaggarwal",
    label: "X",
    icon: X,
  },
  {
    href: "https://www.linkedin.com/in/daggarwal/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://github.com/ivorynoise",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.instagram.com/aggarwal__deepak",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://medium.com/@aggarwaldeepak",
    label: "Medium",
    icon: BookOpen,
  },
  {
    href: "https://substack.com/@ivorynoise",
    label: "Substack",
    icon: Layers,
  },
  {
    href: "https://www.reddit.com/user/ivorynoise",
    label: "Reddit",
    icon: MessageCircle,
  },
];

type SocialSubset = "full" | "hero";

/** Homepage hero: four platforms only; X / Medium / Substack / Reddit stay in the footer. */
const HERO_SUBSET_LABELS = ["YouTube", "LinkedIn", "GitHub", "Instagram"] as const;

function resolveLinkList(subset: SocialSubset | undefined, limit?: number): SocialLink[] {
  if (subset === "hero") {
    return HERO_SUBSET_LABELS.map((label) => links.find((l) => l.label === label)).filter(
      (x): x is SocialLink => x != null
    );
  }
  if (typeof limit === "number") return links.slice(0, limit);
  return links;
}

type Props = {
  compact?: boolean;
  onDark?: boolean;
  /** Outlined “ghost” pills (e.g. homepage hero). */
  variant?: "default" | "ghost";
  /** Full list (default) or homepage subset (YouTube, LinkedIn, GitHub, Instagram). */
  subset?: SocialSubset;
  /** If set, only the first N links of the full list are rendered. Ignored when `subset="hero"`. */
  limit?: number;
  /** Tighter padding, smaller type and icons (dense home hero). */
  dense?: boolean;
  className?: string;
};

export function SocialLinks({
  compact = false,
  onDark = false,
  variant = "default",
  subset = "full",
  limit,
  dense = false,
  className = "",
}: Props) {
  const list = resolveLinkList(subset, limit);
  const tight = dense || compact;

  const pillDefault = [
    "inline-flex items-center rounded-[var(--radius-sm)] border transition-colors",
    tight ? "gap-1.5 px-2.5 py-1" : "gap-2 px-3.5 py-2",
    onDark
      ? "border-white/20 text-cream/75 hover:border-cream/50 hover:text-cream"
      : "border-slate/80 text-nocturne/80 hover:bg-sand/55",
  ].join(" ");

  const pillGhost = [
    "inline-flex items-center rounded-[var(--radius-sm)] border transition-colors",
    tight ? "gap-1.5 px-2.5 py-1" : "gap-2 px-3.5 py-2.5",
    "border-nocturne/[0.14] bg-transparent text-nocturne hover:bg-sand/45 hover:border-nocturne/25",
  ].join(" ");

  const pill = variant === "ghost" ? pillGhost : pillDefault;
  const iconSize = dense ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div
      className={`flex flex-wrap gap-1.5 sm:gap-2 ${className}`}
      style={{ fontSize: dense ? "var(--text-xs)" : "var(--text-sm)" }}
    >
      {list.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
          onClick={() =>
            posthog.capture("social_link_clicked", { platform: label, href })
          }
        >
          <Icon className={`${iconSize} shrink-0`} aria-hidden />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
