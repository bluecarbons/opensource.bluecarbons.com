# BLUECARBONS Open Source — Project Notes

_Last updated: 2026-07-02_

This file is a durable working memory for the `opensource.bluecarbons.com` build. If a session fails or hits a tool-call limit, read this file first to resume state.

---

## 1. Project Goal

Build an open-source showcase site for BLUECARBONS at:
- `https://opensource.bluecarbons.com` (custom domain, CNAME already set in repo)
- `https://bluecarbons.github.io` (GitHub Pages fallback)

Purpose: highlight open-source products BLUECARBONS builds, starting with **Agentic RSS Parser**, with room to grow into a full project catalog.

Repo: `bluecarbons/opensource.bluecarbons.com` (public, currently has only `CNAME` + `README.md`).

---

## 2. Reference #1 — Layout & Feel: Google.org (Google's Philanthropy)

URL: https://www.google.org/intl/en_uk/

Takeaways to emulate:
- Editorial, mission-first hero — big clear statement of purpose, not a sales pitch.
- Generous whitespace, calm pacing, not dense SaaS-style stacking.
- Clear card-based grid for "focus areas" / initiatives — translates to our "Projects" grid.
- Simple top-level navigation, not overloaded with menu items.
- Photography/illustration used sparingly, purposefully, to reinforce mission rather than decorate.

Applied to our site:
- Hero states our mission ("Agentic Foundation done right") before anything else.
- Projects section is the equivalent of Google.org's "focus areas" — card grid, one clear image + title + short description per card.
- Restraint over ornamentation: no gradient blobs, no icon-in-circle grids (per website-building skill anti-patterns).

---

## 3. Reference #2 — Color & Font System: a16z Jobs

URL: https://jobs.a16z.com/jobs

Raw CSS variables captured directly from page (site is served over Webflow/custom CSS):

```css
:root {
  --post-border: #e7e1d2;
  --post-eyebrow: #727069;
  --header-color: #fff;
  --primary: #336D5D;
  --primary-light: #E9EEED;
  --primary-medium: #D1E6E0;
  --text: #000000;
  --link: #336D5D;
  --hover: #336D5D;
  --text-light: #0000007A;
  --background-primary: #F6F4EE;
  --background-secondary: #E7E1D2;
  --background-tertiary: #F0ECE3;
}
```

Extended neutral/accent scale also captured (used for future states — hover, focus, alerts — not primary UI):
- Neutral scale: `--neutral-000` (#FAFBFC) through `--neutral-900` (#142C3A)
- Active/amber scale: `--active-000` (#FFFAF0) through `--active-900` (#B86200) — reserved, NOT used as primary accent (we chose green to match a16z's actual primary, not the amber utility scale)
- Blue scale: `--blue-050` to `--blue-900`
- Teal scale: `--teal-050`, `--teal-200`, `--teal-500`
- Green (semantic) scale: `--green-050` to `--green-900`
- Red (semantic) scale: `--red-050`, `--red-100`

### Decision: our production token mapping

| Token | Value | Source |
|---|---|---|
| `--color-bg` | `#F6F4EE` | a16z `--background-primary` |
| `--color-surface` | `#FBFAF6` | derived lighter than bg |
| `--color-surface-2` | `#F0ECE3` | a16z `--background-tertiary` |
| `--color-surface-offset` / `--color-divider` | `#E7E1D2` | a16z `--background-secondary` / `--post-border` |
| `--color-text` | `#14150F` (near-black, softened) | a16z `--text` (#000) softened for warmth |
| `--color-text-muted` | `#55564B` | a16z `--text-light` reinterpreted as opaque hex |
| `--color-primary` | `#336D5D` | a16z `--primary` |
| `--color-primary-highlight` | `#D1E6E0` | a16z `--primary-medium` |

Fonts:
- Display: **Newsreader** (editorial serif, Google Fonts) — chosen to give the "philanthropy/mission" editorial warmth Google.org has, rather than a cold SaaS sans.
- Body: **Inter** — clean, highly legible, standard for UI chrome/buttons/small text.
- Rationale: a16z jobs page itself likely uses a system/sans stack for body; we're intentionally adding the serif display layer to borrow Google.org's editorial tone while keeping a16z's color logic.

---

## 4. Reference #3 — Flagship Project Content: Agentic RSS Parser

Repo: `bluecarbons/agentic-rss-parser` (public, MIT licensed, v1.3.5, JavaScript, 1 star)

### One-line description
An enterprise-grade Node.js library for parsing RSS and Atom feeds — `rss-parser`-compatible API, plus agentic analysis, deduplication, enrichment, and multi-SDK tool integration.

### Why it matters (positioning for card + subpage)
- Migrating from `rss-parser` is a one-line import change — zero breaking changes.
- `rss-parser` hasn't had a security update since 2022 — this project explicitly reduces supply-chain risk.
- Zero runtime dependencies. Custom XML engine (non-recursive, quote-aware) is naturally immune to XXE / Billion Laughs attacks.
- Native JSON-RPC MCP server — works with Claude Desktop, Cursor, VS Code, any MCP-compliant host.
- Native LLM adapters for OpenAI + Anthropic via built-in `fetch()` — no SDK bloat required.
- Built-in SQLite (`node:sqlite`) caching/deduplication.

### Core features (for subpage feature list)
- RSS 2.0 & Atom support: namespaces, CDATA, HTML entities, `dc:creator`, `media:content`, `content:encoded`
- Drop-in `rss-parser` compatibility: `parseURL`, `parseString`, `parseFile`, `customFields`, callback + promise styles
- Configurable heuristic relevance scoring — no API key required (`signals`, `extraSignals`, `threshold`)
- LLM analysis via OpenAI, Anthropic, and local (Ollama) providers
- Article enrichment — fetches + strips full article body from item URLs
- MCP server exposing `fetch_rss_feed` and `fetch_full_article` tools
- SQLite SHA-256 deduplication across runs
- SDK integration examples: Anthropic SDK, OpenAI Agents SDK, Vercel AI SDK, LangChain, Google ADK
- `userAgent` override to avoid 403s from bot-blocking feeds (Reddit, HN, Lobste.rs)

### Security posture (important trust-building content block)
- XXE / Billion Laughs: DOCTYPE/ENTITY ignored, never expanded
- XSS mitigation: `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>` stripped from snippets
- Prompt injection defense: control chars stripped, newlines collapsed before LLM interpolation
- Response size caps: 5MB feed responses, 1MB LLM responses
- SSRF protection: non-HTTP(S) schemes rejected; RFC-1918 private ranges, loopback, link-local, IPv6 ULA blocked on every request + redirect hop
- Iterative (state-machine) XML parsing — no stack overflow risk
- Minimal, intentional, auditable dependency surface

### Requirements
- Node.js >= 22.5.0 (needed for `node:sqlite`)
- ESM-only package
- Linux, macOS, Windows supported

### Install
```bash
npm install agentic-rss-parser
# or
pnpm add agentic-rss-parser
```

### Quick usage example (for subpage code block)
```js
import Parser from 'agentic-rss-parser';

const parser = new Parser({ timeout: 10000 });
const feed = await parser.parseURL('https://news.ycombinator.com/rss');
for (const item of feed.items) {
  console.log(`- ${item.title} — ${item.link}`);
}
```

### CLI
```bash
npx agentic-rss --feed https://news.ycombinator.com/rss
```

### MCP server
```bash
npx agentic-rss-mcp
```
Tools exposed: `fetch_rss_feed`, `fetch_full_article`.

### Links for subpage
- GitHub: https://github.com/bluecarbons/agentic-rss-parser
- npm: (implied under org) https://npmjs.com/org/bluecarbons
- License: MIT © Blue Carbons

---

## 5. Site Structure & Navigation (confirmed)

**Top navigation (all pages):**
- Left: BLUECARBONS emblem logo (local asset, NOT hotlinked — saved under `images/`)
- Slide-out / collapsible left rail (icons-only when minimized)
- Right: theme toggle, GitHub icon → https://github.com/bluecarbons, npm icon → https://npmjs.com/org/bluecarbons

**Left rail nav items:**
1. Home → `index.html`
2. Charter → `charter.html` (not yet built)
3. Projects → `projects.html` (not yet built; homepage also has inline project grid)
4. Safety → external, https://safety.bluecarbons.com
5. Newsroom → external, https://newsroom.bluecarbons.com

**Homepage hero copy (confirmed exact copy from user):**
- Eyebrow: "BLUECARBONS OPEN SOURCE SOFTWARE (BOSS)"
- H1: "Agentic Foundation done right."
- Subtext: "BLUECARBONS Open-Source Software (BOSS) is rewriting the building blocks of modern agent-driven development for the benefit of everyone."

**Homepage project cards:**
1. Agentic RSS Parser — live card, links to `projects/agentic-rss-parser.html`, full detail subpage
2. Additional cards — greyed-out / muted placeholder style ("Coming soon") until more projects are ready

**Logo asset:**
- Source (original): `https://i0.wp.com/bluecarbons.com/wp-content/uploads/2024/10/BoldOred-BLUECARBONS_emblem-removebg.png`
- Fetch of this URL failed repeatedly in sandbox (blocked/unreachable) — using a temporary generated placeholder emblem at `images/bluecarbons-emblem.png` until the real asset can be supplied directly (upload) or fetched successfully.

---

## 6. Build Status Log

| Batch | Status | Files |
|---|---|---|
| Step 1 — Homepage shell, CSS design system, nav, hero, card grid, dark mode, micro-interactions | **Built locally, NOT yet pushed to repo** (GitHub MCP write tool not available in session) | `index.html`, `styles.css`, `script.js` |
| Step 1 — Placeholder images | **Built locally, NOT yet pushed** | `images/bluecarbons-emblem.png`, `images/agentic-rss-parser.png` |
| Step 2 — Reference notes (this file) | **In progress** | `NOTES.md` |
| Step 3 — Homepage final content pass | Not started | — |
| Step 4 — Polish / motion refinement | Not started | — |
| Batch — Agentic RSS Parser detail subpage | Not started (content researched, see Section 4) | `projects/agentic-rss-parser.html` |
| Batch — `_config.yml` / GitHub Pages setup | Not started | `_config.yml` |
| Real logo + real project card images | Blocked — need direct upload or working fetch | — |

---

## 7. Open Blockers

1. **GitHub MCP write access**: `create_or_update_file`/`push_files`-equivalent tool not exposed in current session tool list, despite read tools (`get_me`, `get_file_contents`, `search_repositories`) working. Repo `bluecarbons/opensource.bluecarbons.com` confirmed to exist and is writable in principle once the tool is exposed.
2. **PAT security note**: a PAT was shared in chat on 2026-07-02 — it should be treated as compromised and rotated regardless of intended short validity.
3. **Real logo image**: original WP-hosted PNG URL not fetchable from sandbox; needs direct upload from user or alternate hosting.

---

## 8. Design Tokens Quick Reference (for consistency across future pages)

```css
--color-bg: #F6F4EE;
--color-surface: #FBFAF6;
--color-surface-2: #F0ECE3;
--color-divider: #E7E1D2;
--color-text: #14150F;
--color-text-muted: #55564B;
--color-primary: #336D5D;
--color-primary-highlight: #D1E6E0;
--font-display: 'Newsreader', Georgia, serif;
--font-body: 'Inter', 'Helvetica Neue', sans-serif;
--rail-width: 232px;
--rail-width-collapsed: 72px;
--topbar-height: 64px;
```

Dark mode uses the same structural tokens with inverted/adjusted values already implemented in `styles.css`.

---

## 9. Next Actions (resume point)

1. Resolve GitHub MCP write access OR get manual push confirmation from user.
2. Push Step 1 batch (`index.html`, `styles.css`, `script.js`, placeholder images) to `bluecarbons/opensource.bluecarbons.com`.
3. Push this `NOTES.md` to repo root.
4. Move to Step 3: refine homepage copy/content using notes above, replace any remaining placeholder text.
5. Build `projects/agentic-rss-parser.html` using Section 4 content.
6. Add `_config.yml` for GitHub Pages, verify CNAME still points to `opensource.bluecarbons.com`.
7. Final polish + motion pass (Step 4).
