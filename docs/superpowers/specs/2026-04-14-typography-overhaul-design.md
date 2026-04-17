# Typography Overhaul — Design Spec

**Date:** 2026-04-14
**Reference:** [bassimeledath.com/blog/levels-of-agentic-engineering](https://www.bassimeledath.com/blog/levels-of-agentic-engineering)
**Approach:** Font swap + type scale tuning (Approach 2)
**Scope:** Sitewide — all pages and components

---

## Goal

Replace the current Playfair Display + Source Sans 3 pairing with Lora + Inter, and tune the type scale, weights, and line-heights to match the clean, editorial feel of the reference site. No layout restructuring; no component rebuilds.

---

## Font Families

| Role | Before | After |
|------|--------|-------|
| Serif (headings, display) | Playfair Display | Lora |
| Sans (body, UI) | Source Sans 3 | Inter |

### Weights to load

**Lora** (via `next/font/google`):
- `400` — body-weight prose headings, blockquotes
- `600` — section headings (h3)
- `700` — article titles, hero headings, h2

**Inter** (via `next/font/google`):
- `300` — light UI text (captions, footnotes)
- `400` — body text, nav links
- `500` — medium weight UI (tags, labels)
- `600` — strong/bold UI (buttons, sidebar labels)

CSS variable names stay unchanged: `--font-title` (serif) and `--font-body` (sans). No downstream class changes required.

---

## Type Scale Tokens (`globals.css` `:root`)

| Token | Before | After | Notes |
|-------|--------|-------|-------|
| `--text-hero` | `clamp(2.5rem, 5.5vw, 4.3rem)` | unchanged | Hero scale is fine |
| `--text-display` | `clamp(1.7rem, 3.2vw, 2.6rem)` | unchanged | Article title scale is fine |
| `--text-title` | `clamp(1.25rem, 2vw, 1.75rem)` | unchanged | Section heading scale is fine |
| `--text-lead` | `clamp(1rem, 1.6vw, 1.2rem)` | unchanged | |
| `--text-body` | `1.0625rem` (17px) | `0.9375rem` (15px) | Match reference's compact body |
| `--text-sm` | `0.9rem` | `0.875rem` | Tighten slightly |
| `--text-xs` | `0.78rem` | unchanged | |
| `--text-label` | `0.68rem` | unchanged | |

---

## Base Styles (`globals.css` `@layer base`)

**Headings default line-height:**
- Before: `line-height: 1.1`
- After: `line-height: 1.15` — Lora is slightly wider-set than Playfair; a touch more room prevents cramping on multi-line titles

---

## Prose Styles (`.prose-content`)

| Property | Before | After |
|----------|--------|-------|
| `font-size` | `var(--text-body)` (1.0625rem) | `var(--text-body)` (0.9375rem after token change) |
| `line-height` | `1.85` | `1.75` |
| `h2 line-height` | `1.1` | `1.2` |
| `h3 line-height` | `1.2` | `1.25` |

No changes to color, spacing, blockquote, code blocks, or table styles.

---

## Blog Article Prose (`.blog-article .blog-article-prose`)

This class overrides prose for the blog post article body specifically.

| Property | Before | After |
|----------|--------|-------|
| `font-size` | `0.875rem` | `0.9375rem` |
| `line-height` | `1.58` | `1.75` |

---

## Files Changed

1. **`src/app/layout.tsx`**
   - Remove `Playfair_Display` and `Source_Sans_3` imports
   - Add `Lora` (weights 400, 600, 700; italic 400) and `Inter` (weights 300, 400, 500, 600)
   - Keep `--font-title` and `--font-body` variable names

2. **`src/app/globals.css`**
   - Update `--font-serif` and `--font-sans` fallback stacks in `@theme inline`
   - Update `--text-body` and `--text-sm` tokens in `:root`
   - Update `h1, h2, h3, h4` base `line-height` in `@layer base`
   - Update `.prose-content` line-height and heading line-heights
   - Update `.blog-article .blog-article-prose` font-size and line-height

---

## Out of Scope

- Layout changes (column widths, max-width, padding)
- Component-level spacing (blog cards, reading list items, nav)
- Dark mode palette adjustments
- Code block / syntax highlight styles
- Any new CSS classes or components

---

## Success Criteria

- Blog post pages feel close to the bassimeledath.com reference: compact, readable body text with authoritative serif headings
- No visual regressions on home page, blog listing, reading list, or books pages
- Both light and dark modes render correctly with the new fonts
- Lighthouse performance unaffected (both fonts are available via `next/font/google` with `display: swap`)
