---
title: "Swapping theme tokens at runtime with plain CSS"
date: "2026-03-30"
category: "technical"
description: "A short, practical pattern: keep brand colors as CSS variables on :root, override them under .dark, and let utilities consume var(--palette-*) so one toggle updates the whole UI."
pinned: true
tags: ["CSS", "design tokens", "dark mode", "Next.js"]
---

When you surface palette colors through a single layer of primitives, the theme switch stops being a rebuild problem and becomes a class on `<html>`.

This mirrors how this site works today: Tailwind maps brand slots to `var(--palette-*)`, and `.dark` swaps those primitives while layout and prose stay the same.

## Two layers

1. **Primitives** — values that actually change between themes, e.g. `--palette-cream`, `--palette-nocturne`.
2. **Semantics** — components read semantics (`background`, `text-ink`) that resolve to those primitives.

## Minimal `:root` / `.dark` contract

```css
:root {
  --palette-cream: #eeeae3;
  --palette-nocturne: #2c2e28;
}

.dark {
  --palette-cream: #131412;
  --palette-nocturne: #e6e4dc;
}
```

Utility output stays `background-color: var(--palette-cream)` instead of baked-in hex, so it tracks runtime overrides.

## Toggle from React

```typescript
function toggleDarkMode() {
  const root = document.documentElement;
  const next = !root.classList.contains("dark");
  root.classList.toggle("dark", next);
  localStorage.setItem("theme", next ? "dark" : "light");
}
```

Pair that with a tiny inline script in `<head>` so the first paint respects `localStorage` and avoids a flash.

## Fenced TypeScript (async loader)

```typescript
export async function applyThemePreference() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") {
    document.documentElement.classList.toggle("dark", stored === "dark");
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", prefersDark);
}
```

## Shell check

```bash
# Optional: curl the page and assert the blocking script exists
curl -sSf "http://localhost:3000" | rg "localStorage.getItem\\('theme'\\)" -q
echo "Theme bootstrap present"
```

---

## Why it scales

- One observer (`MutationObserver` or `localStorage`) can drive the toggle control without fighting hydration.
- **Markdown / MDX** body, cards, and navigation all inherit the same tokens, so dark mode does not “half apply”.

If you scope a band (like a footer) differently, reset `--palette-*` on that subtree instead of reintroducing one-off hex values in components.
