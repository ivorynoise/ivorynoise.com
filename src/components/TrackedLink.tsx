"use client";

import posthog from "posthog-js";
import type { AnchorHTMLAttributes } from "react";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  event: string;
  properties?: Record<string, unknown>;
}

export function TrackedLink({ event, properties, onClick, children, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        posthog.capture(event, properties);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
