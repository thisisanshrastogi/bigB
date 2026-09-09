# 04 · Features

Scope ledger. `P0` = launch, `P1` = shortly after, `P2` = later. Every P0 has an acceptance test.

---

## A. Authoring

| # | Feature | P | Acceptance |
| --- | --- | --- | --- |
| A1 | Create post from a template | P0 | Gallery → `Use template` creates a `draft` with `mode:'template'`, the template's slots present and empty, and lands in the editor. |
| A2 | Create blank post | P0 | `Start blank` creates `mode:'custom'`, one focused Heading block, `templateId:null`. |
| A3 | Template mode: slot form + live page | P0 | Every slot has a labelled field; the right pane renders the public page component; empty slots are absent from the preview, not shown as holes. |
| A4 | Custom mode: block canvas | P0 | Insert by click and by drag; reorder by handle; duplicate; delete with undo; inspector edits the selected block only. |
| A5 | Repeatable slots / steps | P0 | Add, remove, drag-reorder; numbering is automatic; `min`/`max` respected. |
| A6 | Autosave + save state | P0 | 800 ms after the last keystroke a single PATCH fires; the bar reads `Saved <hh:mm>`; a forced failure shows `Not saved · Retry` and blocks Publish. |
| A7 | Local unsaved-changes recovery | P0 | Kill the tab mid-edit, reopen: banner offers `Restore` / `Discard` and restoring reproduces the content. |
| A8 | Undo / redo | P0 | `⌘Z` / `⇧⌘Z` covers the last 50 content mutations including block delete. |
| A9 | Mode switch template → custom | P0 | Filled slots become the equivalent blocks in template order; empty ones are dropped; a 10 s `Undo` toast reverts. |
| A10 | Mode switch custom → template | P1 | Offered only when `template.matches(blocks)`; otherwise disabled with the reason shown. |
| A11 | Slug auto-generation + manual override | P0 | Slug derives from the title on first entry, stops tracking once edited by hand, validates uniqueness inline. |
| A12 | Keyboard shortcuts | P1 | `⌘S`, `⌘⏎`, `Esc`, `⌘↑/↓`, `⌘D`, `/`. |
| A13 | Save a post as a template | P2 | Dashed tile in the gallery; captures block order as a new template with editable labels. |
| A14 | Revisions on published posts | P1 | Editing a published post writes a revision; `Update live` promotes, `Discard` drops; live page unaffected in between. |
| A15 | Revision history browser | P2 | List of the last 20 revisions with restore. |

## B. Blocks

| # | Feature | P | Acceptance |
| --- | --- | --- | --- |
| B1 | Heading, Text, Image, Quote, Steps, List, CTA, Divider | P0 | Each renders identically in canvas, preview and public page (one `BlockRenderer`). |
| B2 | Card block bound to the catalogue | P0 | Picking a card stores `cardId` only; changing the catalogue fee updates every post using it; a missing card renders nothing and raises an advisory check. |
| B3 | Callout (info / warn) | P0 | Two tones, both ≥ 4.5:1 contrast. |
| B4 | Table block | P1 | Add/remove rows and columns; horizontally scrollable on mobile with a shadow affordance. |
| B5 | Embed block (YouTube / X / generic) | P1 | Lazy iframe with a click-to-load poster; no third-party JS before interaction. |
| B6 | Rich text subset with sanitisation | P0 | Only `p strong em a code ul ol li br` survive a save; a pasted `<script>` is stripped server-side. |
| B7 | Image width variants (inline / wide / full) | P1 | Three widths render distinctly at `lg+`, all full-width at `sm`. |
| B8 | Block presets ("save as preset") | P2 | Save a configured block for reuse across posts. |

## C. Media

| # | Feature | P | Acceptance |
| --- | --- | --- | --- |
| C1 | Drag-and-drop upload with progress | P0 | Multi-file drop shows optimistic tiles; rejects wrong type/size per file with the reason, without failing the batch. |
| C2 | Three derived widths + blurhash | P0 | 640/1280/2400 generated; `next/image` serves the right one; blur placeholder before load. |
| C3 | Required alt text | P0 | Cannot insert an image without alt; pre-flight fails while any used image lacks it. |
| C4 | Media picker dialog from any image slot | P0 | Same grid and detail panel as the standalone page; returns `{mediaId, alt, focal}`. |
| C5 | "Used in n posts" + delete protection | P0 | Delete blocked with the list of using posts. |
| C6 | Folders | P1 | Assign and filter by folder. |
| C7 | Focal point picker | P1 | Click a point on the preview; crops honour it at every aspect ratio. |
| C8 | Search by filename / alt | P1 | |

## D. Publishing

| # | Feature | P | Acceptance |
| --- | --- | --- | --- |
| D1 | Pre-flight checklist | P0 | Shared evaluator; blocking items disable the primary button; each row's fix action focuses the field. |
| D2 | Publish now | P0 | Status flips, `publishedAt` set once, tags revalidated, post visible on `/blog` within 30 s without a deploy. |
| D3 | Schedule + cron publish | P0 | `scheduledFor ≥ now+5min`; the cron endpoint publishes due posts idempotently; a missed window publishes on the next run. |
| D4 | Cancel / edit schedule | P0 | From the row menu; cancelling returns to `draft` with an undo toast. |
| D5 | Unpublish with consequence copy | P0 | Confirm dialog states the 410 + sitemap removal; draft retained. |
| D6 | Social card preview | P0 | Renders the actual og image, domain, title and description that will ship. |
| D7 | Preview token links | P0 | Signed, single-post, 7-day, `noindex`; works logged out. |
| D8 | Also-do toggles (newsletter, feature, sitemap ping) | P1 | Each toggle triggers its job exactly once per publish. |
| D9 | Duplicate post | P1 | Copy with `(copy)` title, fresh slug, `draft`. |
| D10 | Trash + 30-day restore | P1 | Slug released only on hard delete. |

## E. Studio management

| # | Feature | P | Acceptance |
| --- | --- | --- | --- |
| E1 | Posts list: search, filter, sort, pagination | P0 | Counts on chips match the rows; 25/page; `q` matches title and slug. |
| E2 | Stat cards | P0 | Published / Scheduled / Drafts from `counts`; Reads from analytics (or hidden if unavailable — never a fake number). |
| E3 | Row menu actions | P0 | Per D-series + Copy URL + View live. |
| E4 | Template gallery with wireframe thumbnails | P0 | Seven templates, purpose line, section count, usage count. |
| E5 | Settings: blog identity, categories, author, SEO defaults, newsletter | P0 | Changes take effect on the public site after revalidation. |
| E6 | Category CRUD with reassignment on delete | P0 | Deleting a used category forces a reassignment choice. |
| E7 | Category order drives public chip order | P0 | |
| E8 | Storage-driver card | P0 | Names the active driver; no screen changes when it swaps. |
| E9 | Multi-author | P2 | Author per post; author archive pages. |
| E10 | Roles + review/approval | P2 | Editor/writer split with a review queue. |

## F. Public blog

| # | Feature | P | Acceptance |
| --- | --- | --- | --- |
| F1 | Index with featured post + grid | P0 | 3-up at `xl/lg`, 2-up at `md`, 1-up at `sm`; featured stacks below `lg`. |
| F2 | Category chips + category pages | P0 | Chips scroll-snap on mobile; `/blog/category/[slug]` renders with the category description. |
| F3 | Pagination | P0 | `postsPerPage` from settings; crawlable `?page=` links. |
| F4 | Post page (hero, steps, quote, one CTA) | P0 | Matches board `2b`; no more than one CTA and one callout per article. |
| F5 | Reading progress + minutes left | P0 | Progress bar in the nav; `role="progressbar"`; hidden below `lg` for minutes-left text. |
| F6 | Sticky table of contents | P0 | Sticky rail at `lg+`; `<details>` accordion below. |
| F7 | Related posts | P0 | Same category first, then most recent; never the current post. |
| F8 | Share row (copy link, LinkedIn, X) | P0 | Copy yields a clean canonical URL with no tracking params. |
| F9 | Newsletter patch (index + article) | P0 | Double opt-in; success replaces the form in place; rate-limited. |
| F10 | Responsive at 390 / 834 / 1280 / 1600 | P0 | No horizontal scroll; body ≥ 17px; tap targets ≥ 44px; article measure ≤ 696px. |
| F11 | SEO: metadata, OG, JSON-LD, sitemap, RSS | P0 | `BlogPosting` on every post, `HowTo` on how-to posts; sitemap excludes `noindex` and unpublished. |
| F12 | Dark mode | P2 | Not planned; the paper ground is the brand. |
| F13 | Search on the public blog | P2 | |
| F14 | Series / collections | P2 | |

## G. Cross-cutting

| # | Feature | P | Acceptance |
| --- | --- | --- | --- |
| G1 | Auth on `/studio/*` and `/api/studio/*` | P0 | Middleware plus a server-side check on every mutation. |
| G2 | Optimistic concurrency (`version`) | P0 | Two-tab edit produces a 409 and the reload/overwrite dialog. |
| G3 | Accessibility per `02` §6 | P0 | Axe clean on index, post, posts list, editor; full keyboard path through the editor. |
| G4 | Performance budgets per `03` §6 | P0 | Lighthouse ≥ 95 on both public pages, mobile profile. |
| G5 | Analytics events per `01` §9 | P1 | |
| G6 | Error boundaries + empty states | P0 | Every list has a designed empty state; a block render error degrades to a placeholder, never a blank page. |
| G7 | Component library with visual tests | P1 | Stories for the starred components in `02` §5. |
| G8 | Mobile studio | P1 | Posts list and publish usable at `sm`; editing directs to a larger screen with a preview link. |

---

## Explicitly out of scope at launch
Comments, reader accounts, i18n/translations, A/B testing of headlines, AI drafting, public search, dark mode, multi-tenant workspaces, paid subscriptions.
