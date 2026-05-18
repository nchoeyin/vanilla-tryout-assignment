# Mangalam Hope Pipes — Vanilla Landing Page

A pixel-driven, responsive **product detail / marketing landing page** for **Mangalam Hope Pipes** (Premium HDPE Pipes & Coils), built from a Figma design using **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, no bundlers.

This repository was created as part of the **Gushwork frontend assignment** (vanilla tryout) and demonstrates the ability to translate a multi-section marketing layout into clean, accessible, mobile-first markup using only the platform.

---

## Live preview

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
# Option 1 — open directly
start index.html        # Windows
open index.html         # macOS

# Option 2 — any static server
npx serve .
python -m http.server 5500
```

Then visit `http://localhost:5500` (or whichever port your server prints).

---

## Tech stack

| Layer       | Choice                                      |
| ----------- | ------------------------------------------- |
| Markup      | Semantic HTML5                              |
| Styling     | Hand-written CSS (BEM-style class naming)   |
| Behavior    | Vanilla JavaScript (ES5/ES6, no libraries)  |
| Typography  | Google Fonts — **Urbanist** (100–900 + italics) |
| Icons       | Inline SVGs from `assets/icons/`            |
| Build tools | None — zero dependencies                    |

---

## Project structure

```
.
├── index.html              # Single-page entry — all sections live here
├── css/
│   ├── global.css          # Resets, base typography, body defaults
│   └── components.css      # All component & section styles (BEM)
├── js/
│   ├── app.js              # Sticky header, carousels, zoom preview,
│   │                       # FAQ accordion, HDPE process tabs, mobile nav
│   └── utils.js            # (Reserved) navbar partial loader
└── assets/
    ├── fonts/              # (Reserved for self-hosted fonts)
    ├── icons/              # SVG icons (caret, check, social, certs, etc.)
    ├── images/             # Product & hero imagery
    └── logo/               # Brand logo
```

---

## Page sections

The landing page is composed of the following sections, in order:

1. **Site header** — Brand, primary nav with Products dropdown, Contact CTA, and a mobile drawer toggle.
2. **Sticky header** — Clone of the main header that appears after the hero scrolls out of view (driven by `IntersectionObserver`).
3. **Hero** — Breadcrumb, image gallery with thumbnails, certifications strip (BIS / ISO / CE), feature checklist, price card, and dual CTAs.
4. **Brands strip** — "Trusted by hundreds of companies globally" infinite marquee.
5. **Technical specifications** — Performance data overview cards.
6. **Benefits** — Key product advantages.
7. **FAQ** — Accordion-style questions and answers.
8. **Applications** — Horizontal carousel of use-case cards with hover zoom preview.
9. **HDPE manufacturing process** — 8-step tabbed walkthrough with pills + prev/next on mobile.
10. **Testimonials** — Horizontal carousel of customer quotes.
11. **Portfolio** — Project showcase grid.
12. **Resources** — Downloadable spec sheets / brochures.
13. **Contact CTA** — Request-a-quote form with country code selector.
14. **Site footer** — Brand banner, About / Categories / Products / Contact columns, social icons, and a legal strip.

---

## Interactive behavior (`js/app.js`)

| Feature | What it does |
| --- | --- |
| **Sticky header** | Clones the header and reveals it once the hero leaves the viewport using `IntersectionObserver` (with a scroll-based fallback). |
| **Mobile nav** | Toggleable drawer with an expandable "Products" submenu, fully `aria-expanded`-driven. |
| **Applications carousel** | Smooth `scrollBy` paging based on the actual slide width + gap. |
| **Hover zoom preview** | A reusable, pointer-fine-only zoom lens that follows the cursor over `.applications-card` and `[data-zoom-source]` zones, with smart edge clamping and reduced-motion support. |
| **Testimonials carousel** | Same scroll-paging pattern as Applications. |
| **HDPE process tabs** | Pills act as tabs (`aria-selected`), with mobile prev/next buttons and a step-detail panel driven by an in-file content map. |
| **FAQ accordion** | Single-open accordion using `aria-expanded` / `aria-controls` and `hidden`. |

---

## Accessibility

The markup leans on platform semantics rather than re-inventing them:

- Landmark elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`).
- `aria-label`, `aria-labelledby`, `aria-controls`, `aria-expanded`, `aria-selected`, and `aria-current` are used on interactive controls.
- Decorative SVGs use `alt=""` + `aria-hidden="true"`.
- A `(prefers-reduced-motion: reduce)` check disables the hover zoom preview animations.
- All carousels and accordions are keyboard-friendly (real `<button>` elements, not `<div>`s).

---

## Responsive design

- Mobile-first CSS with breakpoint refinements for tablet and desktop.
- Hover-only behavior (e.g., zoom preview) is gated behind `(hover: hover) and (pointer: fine)` so touch devices aren't affected.
- The mobile menu fully replaces desktop navigation on small viewports.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). `IntersectionObserver` is required for the sticky-header behavior, with a `scroll` fallback if unavailable.

---

## Development notes

- **No build step.** Edits to HTML / CSS / JS are reflected on refresh.
- **BEM naming** is used throughout `components.css` (`block__element--modifier`) to keep selectors flat and predictable.
- `css/global.css` intentionally stays tiny — only resets and body-level typography live there; everything else is component-scoped in `components.css`.
- `js/utils.js` contains a reserved navbar-partial loader that is currently unused (the navbar is inlined in `index.html` for simplicity).

---

## Status

This is an assignment / portfolio piece — not a production product site. Contact details, product copy, and imagery are placeholders sourced from the Figma reference.
