# Typography Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Playfair Display + Source Sans 3 with Lora + Inter and tune type scale/line-heights to match the editorial feel of bassimeledath.com.

**Architecture:** Two files only — `layout.tsx` loads the new Google Fonts via `next/font/google`; `globals.css` updates fallback stacks, scale tokens, and prose line-heights. CSS variable names (`--font-title`, `--font-body`) are unchanged so no components need touching.

**Tech Stack:** Next.js 16 App Router, `next/font/google`, Tailwind CSS v4, custom CSS variables

---

## File Map

| File | What changes |
|------|-------------|
| `src/app/layout.tsx` | Remove `Playfair_Display`/`Source_Sans_3` imports; add `Lora`/`Inter` with correct weights |
| `src/app/globals.css` | Font fallback stacks, `--text-body`, `--text-sm`, heading `line-height`, `.prose-content` line-heights, `.blog-article-prose` font-size + line-height |

---

## Task 1: Swap font imports in `layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the font imports and configs**

Open `src/app/layout.tsx`. Replace the two font blocks (import line + both font config objects):

```tsx
// REMOVE this line:
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

// REPLACE with:
import { Lora, Inter } from "next/font/google";
```

```tsx
// REMOVE:
const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const titleFont = Playfair_Display({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

// REPLACE WITH:
const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const titleFont = Lora({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
```

Everything else in `layout.tsx` (the `className` usage on `<html>`, the `--font-body`/`--font-title` variable names) stays exactly the same.

- [ ] **Step 2: Verify the build compiles**

```bash
infisical secrets --env=prod npm run build
```

Expected: build completes with no errors. The `.next` output should reference `lora` and `inter` font files instead of `playfair-display` and `source-sans-3`.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: swap fonts to Lora + Inter"
```

---

## Task 2: Update font fallback stacks in `globals.css`

**Files:**
- Modify: `src/app/globals.css` (lines ~52–54, inside `@theme inline`)

- [ ] **Step 1: Update the `--font-serif` and `--font-sans` fallback stacks**

Find this block inside `@theme inline` (around line 52):

```css
/* ── Font families (override Tailwind defaults, pull from next/font vars) ── */
--font-serif: var(--font-title), "Playfair Display", Georgia, "Times New Roman", serif;
--font-sans:  var(--font-body),  "Source Sans 3", "Inter", system-ui, sans-serif;
```

Replace with:

```css
/* ── Font families (override Tailwind defaults, pull from next/font vars) ── */
--font-serif: var(--font-title), "Lora", Georgia, serif;
--font-sans:  var(--font-body),  "Inter", system-ui, sans-serif;
```

- [ ] **Step 2: Start dev server and verify fonts load**

```bash
infisical secrets --env=prod npm run dev
```

Open http://localhost:3000. Open browser DevTools → Network → filter by "font". You should see requests for `lora` and `inter` font files (woff2), not playfair or source-sans. Headings should render in Lora, body text in Inter.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "fix: update font fallback stacks to Lora and Inter"
```

---

## Task 3: Update type scale tokens and base heading line-height

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update `--text-body` and `--text-sm` tokens**

Find these two lines inside `:root` (around line 73–74):

```css
--text-body:    1.0625rem;
--text-sm:      0.9rem;
```

Replace with:

```css
--text-body:    0.9375rem;
--text-sm:      0.875rem;
```

- [ ] **Step 2: Update base heading `line-height`**

Find this block in `@layer base` (around line 152–155):

```css
h1, h2, h3, h4 {
  font-family: var(--font-serif);
  line-height: 1.1;
}
```

Replace with:

```css
h1, h2, h3, h4 {
  font-family: var(--font-serif);
  line-height: 1.15;
}
```

- [ ] **Step 3: Check dev server — verify body text is slightly more compact**

With dev server still running (or restart it), check http://localhost:3000. Body text across the site should feel slightly tighter/more compact than before — this is correct. Headings should have a touch more breathing room between lines.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "fix: tighten type scale tokens and heading line-height for Lora"
```

---

## Task 4: Update `.prose-content` line-heights

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update `.prose-content` body line-height**

Find the `.prose-content` rule (around line 221):

```css
.prose-content {
  font-size: var(--text-body);
  line-height: 1.85;
  color: rgba(44, 46, 40, 0.78);
}
```

Change `line-height` only:

```css
.prose-content {
  font-size: var(--text-body);
  line-height: 1.75;
  color: rgba(44, 46, 40, 0.78);
}
```

- [ ] **Step 2: Update `.prose-content h2` line-height**

Find `.prose-content h2` (around line 235):

```css
.prose-content h2 {
  font-family: var(--font-serif);
  font-size: var(--text-display);
  font-weight: 600;
  color: var(--color-nocturne);
  margin-top: 2.5em;
  margin-bottom: 0.6em;
  line-height: 1.1;
}
```

Change `line-height` only:

```css
.prose-content h2 {
  font-family: var(--font-serif);
  font-size: var(--text-display);
  font-weight: 600;
  color: var(--color-nocturne);
  margin-top: 2.5em;
  margin-bottom: 0.6em;
  line-height: 1.2;
}
```

- [ ] **Step 3: Update `.prose-content h3` line-height**

Find `.prose-content h3` (around line 245):

```css
.prose-content h3 {
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 600;
  color: var(--color-nocturne);
  margin-top: 2em;
  margin-bottom: 0.5em;
  line-height: 1.2;
}
```

Change `line-height` only:

```css
.prose-content h3 {
  font-family: var(--font-serif);
  font-size: var(--text-title);
  font-weight: 600;
  color: var(--color-nocturne);
  margin-top: 2em;
  margin-bottom: 0.5em;
  line-height: 1.25;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "fix: tune prose-content line-heights for Lora"
```

---

## Task 5: Update `.blog-article-prose` and verify

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update `.blog-article .blog-article-prose` font-size and line-height**

Find this rule (around line 468):

```css
.blog-article .blog-article-prose {
  margin-top: 0;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  line-height: 1.58;
  color: color-mix(in oklab, var(--palette-nocturne) 72%, transparent);
}
```

Change `font-size` and `line-height` only:

```css
.blog-article .blog-article-prose {
  margin-top: 0;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: color-mix(in oklab, var(--palette-nocturne) 72%, transparent);
}
```

- [ ] **Step 2: Visual check on a blog post**

With dev server running, open any blog post (e.g. http://localhost:3000/blog). The article body should feel noticeably more open and readable than before — Inter at 0.9375rem with line-height 1.75 vs the previous Source Sans 3 at 0.875rem / 1.58. Headings should render in Lora with clear serifs.

Check the following pages for regressions:
- `/` — home page (hero, philosophy, expertise sections)
- `/blog` — blog listing + featured carousel
- `/reading` — reading list
- `/books` — books list

- [ ] **Step 3: Check dark mode**

Toggle to dark mode (via the theme button in the header). Verify body text and headings are legible — the font change doesn't affect colors so this should be fine, but confirm visually.

- [ ] **Step 4: Production build check**

```bash
infisical secrets --env=prod npm run build
```

Expected: exits 0 with no errors or warnings about fonts.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "fix: update blog-article-prose to match reference typography"
```
