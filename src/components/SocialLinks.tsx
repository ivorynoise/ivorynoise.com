"use client";

import { Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import type { ComponentType } from "react";
import posthog from "posthog-js";

type SocialLink = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const links: SocialLink[] = [
  { href: "https://youtube.com",   label: "YouTube",   icon: Youtube   },
  { href: "https://x.com",         label: "Twitter",   icon: Twitter   },
  { href: "https://linkedin.com",  label: "LinkedIn",  icon: Linkedin  },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://github.com",    label: "GitHub",    icon: Github    },
];

type Props = {
  compact?: boolean;
  
  onDark?: boolean;
};

export function SocialLinks({ compact = false, onDark = false }: Props) {
  const pill = [
    "inline-flex items-center gap-2 rounded-[var(--radius-sm)] border transition-colors",
    compact ? "px-3 py-1.5" : "px-3.5 py-2",
    onDark
      ? "border-white/20 text-cream/75 hover:border-cream/50 hover:text-cream"
      : "border-slate/80 text-nocturne/80 hover:bg-sand/55",
  ].join(" ");

  return (
    <div className="flex flex-wrap gap-2" style={{ fontSize: "var(--text-sm)" }}>
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
          onClick={() => posthog.capture("social_link_clicked", { platform: label, href })}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
