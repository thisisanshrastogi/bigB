# 01 · Flows

Amalgamic Blog Studio. Single admin (Lizann) publishing to `amalgamic.io/blog`.
Companion docs: `02-screens-and-design.md`, `03-functionality.md`, `04-features.md`, `05-implementation-plan.md`.

---

## 1. Actors

| Actor | Surface | Notes |
| --- | --- | --- |
| **Admin** | `/studio/*` (auth required) | Creates, edits, schedules, publishes. Single seat at launch; the data model already carries `authorId`, so more seats are additive. |
| **Reader** | `/blog`, `/blog/[slug]`, `/blog/category/[slug]` | Anonymous. No accounts, no comments. |
| **Build/cron job** | server | Flips `scheduled → published` at the due minute, revalidates caches, pings the sitemap. |
| **Card catalogue** | internal data (`src/lib/cards.js` today) | Read-only source for the Card block, so fee/credit figures never go stale inside a post. |

---

## 2. Post lifecycle (state machine)

```
                ┌──────────── revert ─────────────┐
                ▼                                 │
  (new) ──► DRAFT ──► SCHEDULED ──► PUBLISHED ──► UNPUBLISHED
              │  ▲         │             │  ▲          │
              │  └── cancel┘             │  └── republish
              └──── delete ──► TRASH ◄───┘
```

| State | Visible publicly | Allowed transitions | Invariants |
| --- | --- | --- | --- |
| `draft` | no (preview token only) | → `scheduled`, → `published`, → `trash` | May be incomplete. No validation enforced. |
| `scheduled` | no (preview token only) | → `published` (auto/manual), → `draft` (cancel), → `trash` | Must pass pre-flight. `scheduledFor` is in the future. |
| `published` | yes | → `unpublished`, stays `published` on edit | Must pass pre-flight. `publishedAt` immutable after first publish. |
| `unpublished` | no (410/redirect) | → `published` | Draft body retained. Removed from index + sitemap. |
| `trash` | no | → `draft` (restore), hard delete after 30 days | Slug released only on hard delete. |

**Editing a published post** does not change state. It writes to a *revision*; `Update live` promotes the revision, `Discard` throws it away. The live page keeps serving the last published revision in the meantime.

---

## 3. Master flow map

```
/studio  (auth gate)
   │
   ├─► POSTS  ──────────────────────────────────────────────┐
   │     │  New post                                        │
   │     ├──────────────► TEMPLATE GALLERY                   │
   │     │                    │ pick template                │
   │     │                    │ or "Start blank"             │
   │     │                    ▼                              │
   │     │              EDITOR ── mode: template | custom ───┤
   │     │                    │                              │
   │     ├── row click ───────┘                              │
   │     │                                                   │
   │     │            EDITOR ──► Publish ──► PUBLISH SHEET ──┤
   │     │                          │            │           │
   │     │                          │        schedule ───────┤
   │     │                          └──► publish now ────────┤
   │     │                                                   │
   │     └── row menu ► duplicate / unpublish / trash ───────┤
   │                                                          │
   ├─► MEDIA ──► detail panel ──► "Insert into post" ─────────┤
   ├─► TEMPLATES (gallery, also reachable standalone)         │
   └─► SETTINGS ► blog · categories · author · seo · newsletter
                                                              │
                                       ┌──────────────────────┘
                                       ▼
                            PUBLIC  /blog  ──► /blog/[slug]
                                       └────► /blog/category/[slug]
```

---

## 4. Primary flow — publish a post (happy path)

Screen references are the board ids in `Blog Studio.dc.html`.

1. **Posts** (`1g`) → *New post*.
2. **Template gallery** (`1e`) → pick *How-to guide*. System creates a `draft` with `mode: "template"`, `templateId: "how-to"`, empty sections, slug derived from nothing yet (slug generated on first title keystroke).
3. **Editor · Template mode** (`2c`)
   - Left: one labelled field per template slot. Right: the live page, rendered by the *same* renderer the public site uses, at Desktop/Tablet/Phone.
   - Autosave 800 ms after the last keystroke; `Saved 12:04` in the top bar. Empty slots are skipped by the renderer, never rendered as holes.
   - Slot counter (`5 of 7 slots`) is progress, not a gate.
4. *(optional)* **Switch to Custom** → template sections are converted to blocks (§6) and the canvas (`2a`) takes over. One-way per post unless the user undoes immediately.
5. **Publish** → **Publish sheet** (`1i`): pre-flight checklist, social card preview, `Publish now` / `Schedule`, side toggles (newsletter, feature on blog home, ping sitemap).
6. **Schedule** → status `scheduled`, back to Posts with a toast (`Scheduled for Tue 9 Sept, 09:00 · Undo`).
7. **Cron** at the due minute: status → `published`, `publishedAt` set, cache revalidated for `/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/sitemap.xml`; newsletter job enqueued if toggled.
8. **Reader** lands on the post page (`2b`).

### Timing / async rules
- Autosave is optimistic; a failure shows a persistent `Not saved — retry` chip and blocks Publish.
- Publish is a single server call that validates again server-side; the button shows a spinner and is disabled until it resolves.
- The scheduler is idempotent: re-running the job for an already-published post is a no-op.

---

## 5. Secondary flows

### 5.1 Start blank (no template)
Posts → New post → *Start blank* → editor opens in **Custom** mode with one Heading block focused. `templateId: null`.

### 5.2 Edit a published post
Posts → row click → editor loads `published` content into a revision → top bar shows `Editing live post · changes are private until you update`. Actions: `Update live`, `Save as draft revision`, `Discard changes`.

### 5.3 Media
Two entry points, same component:
- **Standalone** (`1h`): Media nav → grid → select → detail panel (alt text required before the file can be inserted anywhere) → *Insert into post* is disabled unless an editor session is open.
- **In-editor**: any image slot/block → *Choose image* → the library opens as a dialog with the same grid + detail panel, in "picker" mode (returns `{mediaId, alt, focal}`).

Upload: drag anywhere in the media surface → optimistic tile with progress → server returns three widths (`640/1280/2400`) + blurhash → tile becomes real. Alt text is empty and flagged; the pre-flight checklist fails while any image used in the post has no alt.

### 5.4 Schedule, then change your mind
Posts → row menu → `Edit schedule` (re-opens the publish sheet at the When step) or `Cancel schedule` (→ `draft`, toast with Undo).

### 5.5 Unpublish
Posts → row menu → `Unpublish` → confirm dialog naming the consequence ("the URL will return 410 and it leaves the sitemap; the draft is kept"). → `unpublished`.

### 5.6 Category management
Settings → Categories (`1j`) → add / rename / reorder / remove. Removing a category used by posts opens a reassignment step ("11 posts use Card picks — move them to…"). Order here is the order of the chips on the public index.

### 5.7 Reader flows
- **Discover**: `/blog` → featured post, category chips (client-side filter for the loaded page, server-side for pagination) → card → post.
- **Read**: post page (`2b`) → reading progress + minutes-left in the nav → sticky contents (desktop) / collapsed accordion (mobile) → end CTA → `Keep reading` (same category first, then recent).
- **Subscribe**: newsletter patch on the index, or the inline patch at the end of a post. Double opt-in email; success state replaces the form in place.
- **Share**: share row copies a canonical URL with no tracking params.

---

## 6. Mode switching rules (Template ⇄ Custom)

| From | To | Behaviour |
| --- | --- | --- |
| Template | Custom | `template.toBlocks(sections)` expands every filled slot into its block equivalent, in template order. Empty slots are dropped. Irreversible after the next autosave; an `Undo` toast covers the 10 s window. |
| Custom | Template | Offered **only** if the block list still matches a template's shape (same block types in the same order, ± trailing blocks). Otherwise the menu item is disabled with the reason. Prevents silent content loss. |

The editor never shows both a palette and a slot form. Mode determines the whole left/right arrangement:

- **Template mode** → slot form (left, 520px) + live page (right). No palette, no canvas, no drag.
- **Custom mode** → palette + outline (left, 212px), block canvas (centre), inspector rail (right, 472px) with tabs `Block settings · Preview · SEO`.

---

## 7. Validation gates (pre-flight)

Run on `publish` and `schedule`, not on save. Blocking items are marked ✕, advisory ones ⚠.

| Check | Level | Rule |
| --- | --- | --- |
| Title | ✕ | non-empty, ≤ 120 chars |
| Slug | ✕ | kebab-case, unique across all non-trashed posts |
| Excerpt | ✕ | 60–160 chars |
| Category | ✕ | one of the configured categories |
| Hero image | ✕ | set, with alt text |
| Alt text on every image | ✕ | non-empty |
| Body not empty | ✕ | ≥ 1 content block / ≥ 1 filled slot beyond the headline |
| SEO title length | ⚠ | ≤ 60 chars (offer `Shorten`) |
| Meta description | ⚠ | falls back to excerpt if unset |
| Reading time | auto | computed, not editable |
| Broken internal links | ⚠ | any `/blog/...` link to a non-published slug |
| Card block freshness | ⚠ | referenced card missing from the catalogue |

---

## 8. Error and edge cases

| Case | Handling |
| --- | --- |
| Slug collision | Inline error at the field + in pre-flight. Suggest `-2` suffix. |
| Two tabs editing the same post | Version number on save; the loser gets `This post changed in another tab — reload or overwrite`. |
| Offline / failed autosave | Persistent chip, local draft kept in `localStorage` under `studio:draft:<id>`, restored on reload with a banner. |
| Scheduled time in the past at submit | Field error: "pick a time at least 5 minutes out". |
| Cron missed a slot (deploy window) | Job publishes any `scheduled` post whose `scheduledFor <= now` on next run; `publishedAt` = actual time, not the intended one. |
| Image upload > 8 MB or wrong type | Rejected at the drop zone with the reason; other files in the same drop still upload. |
| Deleting media used in posts | Blocked; the detail panel lists the posts using it. |
| Reader hits an unpublished/never-published slug | 404 page with a link to `/blog`; unpublished-after-publish returns 410 + the same page. |
| Reader hits a preview URL | Requires `?preview=<token>`; token is single-post, expires in 7 days, `noindex` header. |

---

## 9. Analytics events (minimum set)

`studio_post_created {mode, templateId}`, `studio_mode_switched {from,to}`, `studio_autosave_failed`, `studio_publish {status, checksFailed}`, `studio_media_uploaded {bytes}`, `blog_index_view {category}`, `blog_post_view {slug, readingTime}`, `blog_scroll_depth {slug, pct:25|50|75|100}`, `blog_cta_click {slug, position}`, `newsletter_subscribe {source}`.
