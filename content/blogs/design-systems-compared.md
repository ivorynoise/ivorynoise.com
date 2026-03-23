---
title: "Design Systems Compared: A Deep Dive into the Frameworks That Shape the Web"
date: "2026-03-10"
description: "An exhaustive comparison of the major design systems powering today's products — their philosophies, token structures, component APIs, and the trade-offs you rarely see discussed."
tags: ["design systems", "comparison", "tokens", "components"]
coverImage: "https://picsum.photos/seed/designsystems/800/500"
---

Design systems are no longer optional at scale. But choosing between them — or building your own — is one of the most consequential decisions a product team makes. The wrong choice compounds. A fragmented token structure in year one becomes an unmaintainable mess by year three.

This post is a systematic comparison of six major design systems: their philosophies, component coverage, token architectures, accessibility posture, and the real-world trade-offs that don't appear in the documentation.

![A grid of interface components laid out on a design canvas](https://picsum.photos/seed/components/800/420)

---

## What We Are Even Comparing

First, a clarification. "Design system" is used to describe everything from a Figma component library to a fully-specified, multi-platform token system with a11y audits and release notes. For this comparison, we evaluate systems across five dimensions:

1. **Token architecture** — how design decisions are encoded
2. **Component API** — how components are consumed
3. **Accessibility** — WCAG conformance and keyboard/screen reader support
4. **Theming** — how deeply the system can be customised
5. **Ecosystem** — documentation, tooling, and community

---

## The Six Systems

| System | Maintained by | First release | Primary stack | License |
|---|---|---|---|---|
| Material Design 3 | Google | 2014 (v1) | Web, Android, iOS | Apache 2.0 |
| Carbon | IBM | 2019 | React, web | Apache 2.0 |
| Fluent 2 | Microsoft | 2021 | React, web, native | MIT |
| Polaris | Shopify | 2018 | React | MIT |
| Base UI | (MUI) | 2022 | React | MIT |
| Radix Primitives | WorkOS | 2021 | React | MIT |

---

## Token Architecture

The way a system encodes decisions — colour, spacing, radius, elevation — determines how well it scales and how safely it can be themed.

### Tier structure

Most modern systems use a two or three-tier token model:

| System | Tier 1 (primitive) | Tier 2 (semantic) | Tier 3 (component) |
|---|---|---|---|
| Material 3 | `ref.palette.*` | `sys.color.*` | `comp.button.*` |
| Carbon | `$black`, `$blue-60` | `$text-primary`, `$layer-01` | Yes |
| Fluent 2 | `colorPaletteBerry*` | `colorNeutralForeground1` | Yes |
| Polaris | `--p-color-blue-*` | `--p-color-text`, `--p-color-bg` | Partial |
| Base UI | None built-in | CSS variables by component | No |
| Radix | `--accent-1` through `--accent-12` | Semantic aliases available | No |

**Material 3** has the most rigorous three-tier model and the best tooling for generating palettes from a single seed colour using HCT colour space.

**Carbon** is exceptional at semantic clarity — the token names communicate purpose, not value. `$text-primary` tells you what it is for, not what it looks like.

**Radix** takes a different approach: a 12-step perceptual scale per hue, numbered by use case (1–2 backgrounds, 3–5 interactive components, 6–8 borders, 9–10 solid fills, 11–12 text). Elegant and predictable.

---

## Component Coverage

| Component | Material 3 | Carbon | Fluent 2 | Polaris | Base UI | Radix |
|---|---|---|---|---|---|---|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Select / Combobox | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dialog / Modal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Date picker | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Data table | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Drawer / Sheet | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Toast / Notification | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Tooltip | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Popover | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Context menu | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Toolbar | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Slider | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rich text editor | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

*Note: Radix Primitives and Base UI intentionally omit high-complexity components like data tables, leaving those to the consuming team.*

---

## Accessibility Posture

Accessibility is where the gaps between systems become starkest.

| System | WCAG 2.1 AA | WCAG 2.2 AA | Keyboard nav | Screen reader tested | ARIA patterns |
|---|---|---|---|---|---|
| Material 3 | ✅ | Partial | ✅ | ✅ | ARIA 1.1 |
| Carbon | ✅ | ✅ | ✅ | ✅ | ARIA 1.2 |
| Fluent 2 | ✅ | ✅ | ✅ | ✅ | ARIA 1.2 |
| Polaris | ✅ | Partial | ✅ | ✅ | ARIA 1.1 |
| Base UI | ✅ | ✅ | ✅ | Partial | ARIA 1.2 |
| Radix | ✅ | ✅ | ✅ | ✅ | ARIA 1.2 |

**Carbon** and **Fluent 2** lead here — both have dedicated a11y teams, regular audits with actual screen reader users, and explicit ARIA pattern documentation for every component.

**Radix** is arguably the best in class for unstyled/headless a11y primitives. Every interaction pattern maps directly to a WAI-ARIA authoring practice spec, and the keyboard behaviour is correct out of the box.

---

## Theming Capability

| System | Dark mode | Custom colour | Custom radius | Custom typography | Custom spacing | Design tokens file |
|---|---|---|---|---|---|---|
| Material 3 | ✅ | ✅ (seed-based) | ✅ | ✅ | ✅ | Figma + JSON |
| Carbon | ✅ | ✅ (manual) | Partial | ✅ | ✅ | SCSS + JSON |
| Fluent 2 | ✅ | ✅ | ✅ | ✅ | ✅ | JSON |
| Polaris | ✅ | Limited | ✅ | Partial | ✅ | JSON |
| Base UI | ✅ | ✅ (CSS vars) | ✅ | ✅ | ✅ | None (DIY) |
| Radix | ✅ | ✅ (CSS vars) | N/A | N/A | N/A | CSS vars |

---

## Bundle Size Impact

Bundle size matters in ways that are easy to underestimate in development but very visible in production analytics.

| System | Base import (gzipped) | Per-component avg | Tree-shakeable | SSR-safe |
|---|---|---|---|---|
| Material 3 (Web) | ~48 KB | ~4–8 KB | Partial | Partial |
| Carbon React | ~120 KB | ~12–18 KB | Yes | Yes |
| Fluent 2 | ~52 KB | ~6–10 KB | Yes | Yes |
| Polaris | ~96 KB | ~8–14 KB | Yes | Yes |
| Base UI | ~8 KB | ~2–4 KB | Yes | Yes |
| Radix Primitives | ~3 KB | ~1–3 KB | Yes | Yes |

The headless libraries (**Base UI**, **Radix**) win decisively on bundle size. The trade-off is that you write all the styles yourself — every colour, spacing, and motion decision is yours to own.

---

## Real-World Trade-offs

### When to use Material 3
Use it when your product is deeply integrated with the Android ecosystem or when non-designers on your team need to make reasonable UI decisions without constant design review. The system is opinionated enough that "good enough" is automatic. The cost is distinctiveness — Material 3 sites look like Material 3 sites.

### When to use Carbon
Use it when you are building enterprise software where accessibility is a hard requirement and your team can sustain the weight of a large dependency. IBM invests seriously in a11y and the token system is genuinely excellent. Avoid it for consumer products where the design needs to be brand-expressive.

### When to use Fluent 2
Use it for Microsoft ecosystem products or teams already using Office tooling. The cross-platform story (web, React Native, Teams) is unmatched. The visual language is pleasant and the component quality is high.

### When to use Polaris
Use it exclusively if you are building Shopify apps or themes. Outside of that context, the merchant-commerce vocabulary baked into the component names and patterns becomes friction rather than help.

### When to use Base UI or Radix
Use them when you have a design system and need battle-tested behaviour without inheriting someone else's visual language. These are building blocks, not finished systems. If your team has a designer who produces detailed specs, this is almost always the right choice. If your team relies on the design system to make visual decisions for them, this is the wrong choice.

---

## Summary Recommendation Matrix

| Your situation | Best fit |
|---|---|
| Native Android + Web product | Material 3 |
| Enterprise app, strict a11y requirements | Carbon |
| Microsoft / Teams integration | Fluent 2 |
| Shopify app | Polaris |
| Custom brand, small bundle, design specs provided | Radix Primitives |
| Custom brand, some components needed, no styles | Base UI |
| I want to build my own from scratch | Radix + your own tokens |

---

## Closing Thought

No design system survives contact with your product unchanged. Every one of the systems above was built to solve a specific set of problems for a specific organisation. The question is never "which is the best design system?" The question is always "which trade-offs can we afford?"

The teams that go the furthest with design systems are the ones that treat the choice as a starting point rather than an answer — that document their deviations, audit their customisations, and continually ask whether the system is still serving the product or whether the product has grown to serve the system.

The scaffolding should disappear. The product should remain.
