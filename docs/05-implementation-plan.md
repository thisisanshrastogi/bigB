# 05 · Implementation plan

Target: Next.js (App Router) + React + Tailwind, `CONTENT_DRIVER=postgres`. The current site is Vite + react-router — §1 covers both routes forward.

---

## 0. Decision to make first

The repo (`AmalgamicHQ/amalgam`) is a Vite SPA. Two options:

**A · Migrate the site to Next.js (recommended).** The blog needs static generation, per-post metadata, OG images, sitemap/RSS and ISR — all native in Next, all hand-rolled in a Vite SPA. Cost ≈ 3–5 days for a marketing site of this size (routes → app router, `Navbar`/`Footer` reused as-is, no data layer to port).

**B · Keep Vite, host the blog as a separate Next app** under `/blog` via a rewrite/proxy. Faster to start, but two builds, two nav copies, and shared components diverge.

Everything below assumes **A**. Under B, phases 3–6 are identical inside the sub-app; only the shell differs.

---

## 1. Phase plan

| Phase | Outcome | Est. |
| --- | --- | --- |
| 0 · Foundation | Next app, tokens, primitives, storage adapter behind an interface | 3–4 d |
| 1 · Public rendering | Blocks + `BlockRenderer` + post page + index, fed by fixtures | 4–5 d |
| 2 · Data layer | Postgres schema, `ContentStore`, studio API routes, auth | 3–4 d |
| 3 · Studio shell | Sidebar, posts list, settings, media library | 4–5 d |
| 4 · Editor | Template mode, then custom mode, autosave, preview | 6–8 d |
| 5 · Publishing | Pre-flight, publish sheet, scheduling cron, revalidation | 3–4 d |
| 6 · Polish | Responsive passes, a11y, perf, empty/error states, analytics | 3–4 d |

≈ 26–34 working days for one full-time engineer. Phases 1 and 2 can run in parallel with two.

---

## 2. Phase 0 — foundation

1. `create-next-app` (App Router, TS optional — plain JS is fine and matches the repo), Tailwind.
2. Port the design tokens from `02 §1` into `tailwind.config.js` (`paper`, `ink`, `accent`, `accent-tint`, `highlight`, `muted`, `border`, radii, shadows) and the font links into the root layout. Keep the existing `Navbar`/`Footer` markup verbatim.
3. Build `src/ui/` primitives (`Button`, `Field`, `Input`, `Textarea`, `Select`, `Toggle`, `SegmentedControl`, `Pill`, `Tag`, `Chip`, `Dialog`, `Toast`, `Skeleton`, `Avatar`, `ProgressBar`). Each is a folder with the component + a story.
4. Define `ContentStore` (`03 §4`) and ship the **files** driver first — it needs no infra, so Phase 1 can render real content immediately.
5. Fixtures: `content/fixtures/posts.json` with one post per template, so every block type has a rendering example.

**Exit:** primitives render in a storybook route; `getPost('airline-fee-credit')` returns a fixture through the adapter.

## 3. Phase 1 — public rendering

Order matters: blocks before pages, because the studio reuses them.

1. `blockRegistry.js` — type → `{component, editor, label, icon, defaults, toText}`.
2. One component per block (`03 §1.2`), each responsive on its own, no page-level assumptions.
3. `BlockRenderer` — the switch, with an error boundary per block.
4. `src/blog/templates/*` — seven templates with `slots`, `toBlocks`, `matches`.
5. Post page `/blog/[slug]`: `PostHero`, `TableOfContents`, `ArticleBody`, `PullQuote`, `PostCta`, `RelatedPosts`, `ShareRow`, `ReadingProgress`. Build desktop → tablet → mobile in that order, checking 390/834/1280/1600 at each step.
6. Index `/blog`: `FeaturedPost`, `CategoryChips`, `PostGrid`, `PostCard`, `Pagination`, `NewsletterPatch`.
7. Category page, `sitemap.xml`, `rss.xml`, `generateMetadata`, JSON-LD.

**Exit:** every fixture post renders at all four widths, Lighthouse ≥ 95 mobile, Axe clean.

## 4. Phase 2 — data layer

1. Postgres schema:

```sql
create table posts (
  id text primary key,
  slug text not null,
  status text not null default 'draft',
  mode text not null default 'template',
  template_id text,
  title text not null default '',
  excerpt text not null default '',
  category_id text references categories(id),
  author_id text references authors(id),
  hero jsonb, sections jsonb, blocks jsonb, seo jsonb not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  reading_time_minutes int not null default 0,
  published_at timestamptz, scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version int not null default 1
);
create unique index posts_slug_live on posts (slug) where status <> 'trash';
create index posts_status_updated on posts (status, updated_at desc);
create index posts_scheduled on posts (scheduled_for) where status = 'scheduled';

create table post_revisions (
  id text primary key, post_id text references posts(id) on delete cascade,
  body jsonb not null, created_at timestamptz not null default now(), promoted boolean default false
);
create table media (
  id text primary key, filename text, mime text, bytes int,
  width int, height int, blurhash text, variants jsonb, alt text default '',
  folder text, created_at timestamptz default now()
);
create table categories (id text primary key, name text, slug text unique, description text, "order" int);
create table authors (id text primary key, name text, role text, bio text, avatar jsonb, links jsonb);
create table settings (id int primary key default 1, data jsonb not null);
```

2. `postgres` driver implementing `ContentStore`, with `updatePost` doing `... where id=$1 and version=$2` and throwing `Conflict` on 0 rows.
3. Studio API routes per `03 §2`; one zod schema per body, shared with the client.
4. Auth: NextAuth email magic link, middleware on `/studio/*` + `/api/studio/*`, plus a server-side check inside each mutation.
5. Media storage: S3/R2 (or `public/uploads` for the files driver) + sharp for the three widths + blurhash.
6. `preflight.js` — the single evaluator used by the sheet, the publish route and the cron job.

**Exit:** the whole content model round-trips through the API; a two-tab edit produces a 409.

## 5. Phase 3 — studio shell

1. `StudioShell` + `StudioSidebar` + auth gate + route group `/studio`.
2. Posts list: `PostsTable`, `PostRow`, `StatusPill`, `StatCard`, `FilterChips`, search, sort, pagination, row menu with optimistic mutations + undo toasts.
3. Template gallery: `TemplateCard` + `TemplateThumb` (wireframe thumbnails as small SVG/CSS compositions, one per template).
4. Media library: `DropZone`, `MediaGrid`, `MediaTile`, `MediaDetail`, and `MediaPickerDialog` wrapping the same grid in picker mode.
5. Settings: `SettingsTabs`, `CategoryEditor` (with the reassignment step), `AuthorCard`, `StorageCard`.

**Exit:** an admin can upload media, manage categories and see real posts — no editing yet.

## 6. Phase 4 — editor

Build **template mode first**: it is the guardrailed default and needs no drag machinery.

1. `EditorProvider` — draft state, dirty tracking, `version`, undo stack, autosave (800 ms debounce, changed keys only), `localStorage` mirror, 409 dialog.
2. `StudioTopBar` + `SaveState` + mode switch.
3. `SlotForm`, `SlotField`, `RepeatableSlot` driven by the template's `slots`.
4. `PreviewFrame` + `DeviceSwitch` — mounts the **public** page component, debounced 250 ms, widths 1280/834/390.
5. Custom mode: `BlockCanvas`, `BlockFrame` (selection chrome), `BlockPalette` (click + drag insert, `/` filter), `BlockOutline`, `InspectorRail` with `BlockInspector` / `PreviewFrame` / `SeoPanel`, `PostDetailsCard`.
   - Drag-and-drop: `@dnd-kit/sortable` for both canvas reorder and palette→canvas insert.
   - Inspector fields come from `blockRegistry[type].editor` — adding a block type must never require touching the inspector.
6. Mode conversion (`toBlocks` / `matches`) with the 10 s undo toast.
7. Keyboard map per `03 §3.2`.

**Exit:** both modes create and edit posts end to end; the preview is byte-identical to the public page for the same draft.

## 7. Phase 5 — publishing

1. `PublishSheet` (`Dialog`) + `PreflightChecklist` + `SchedulePicker` + `SocialPreview` + also-do toggles.
2. `/api/studio/posts/:id/publish` — server-side pre-flight, status transition, `revalidateTag` for `blog-index`, `post:<slug>`, `category:<slug>`, `sitemap`.
3. `/api/cron/publish-due` + a Vercel cron every 5 minutes, secret header, idempotent.
4. Preview tokens; `noindex` headers on preview responses.
5. Unpublish (410 + sitemap removal), trash/restore, duplicate.
6. Newsletter job (Resend/Buttondown) behind the also-do toggle; subscribe endpoint with rate limiting and double opt-in.

**Exit:** schedule a post, watch the cron publish it, see it on `/blog` without a deploy.

## 8. Phase 6 — polish

- Responsive sweep: 390 / 834 / 1280 / 1600 on every public page and the posts list; studio editor gated below `md` with a preview link (`04 G8`).
- A11y: landmark audit, heading order, keyboard path through the editor, focus traps, live regions, Axe clean.
- Perf: bundle audit against `03 §6`, confirm only `ReadingProgress`/`ShareRow`/`NewsletterPatch`/chips are client components.
- Empty and error states for every list; per-block error boundary placeholders.
- Analytics events (`01 §9`).
- Seed content: migrate any existing posts, write one real post per template.

---

## 9. Repository layout

```
src/
  app/
    (site)/            page.jsx, about, faq …            # existing marketing pages
    blog/
      page.jsx                                            # index
      [slug]/page.jsx
      category/[slug]/page.jsx
    studio/
      layout.jsx                                          # auth gate + shell
      page.jsx                                            # posts
      templates/page.jsx
      posts/[id]/page.jsx                                 # editor
      media/page.jsx
      settings/page.jsx
    api/
      studio/{posts,media,categories,settings,cards}/…
      public/{posts,subscribe}/…
      cron/publish-due/route.js
    sitemap.js  rss.xml/route.js
  ui/                  # primitives, one folder each
  blog/
    blocks/            # one component per block + blockRegistry.js
    templates/         # seven templates + templateRegistry.js
    components/        # PostHero, PostCard, TableOfContents, …
    preflight.js  readingTime.js  sanitize.js
  studio/
    shell/  posts/  editor/  media/  settings/  publish/
    EditorProvider.jsx
  lib/
    content/  index.js  files.js  postgres.js  cms.js      # ContentStore drivers
    auth.js  images.js  cards.js  analytics.js
content/                # files driver + fixtures
```

Conventions: one component per file, named export matching the filename, no component over ~200 lines, props typed with JSDoc, no business logic in components (it lives in `lib/` or the provider), no `any`-shaped `data` props — blocks receive their own `data` slice only.

---

## 10. Testing

| Level | Tool | Coverage |
| --- | --- | --- |
| Unit | Vitest | `preflight`, `readingTime`, `sanitize`, `toBlocks`/`matches`, slug generation, adapter contract (same suite run against every driver) |
| Component | Testing Library | every block renders from fixture data; `SlotForm` emits correct patches; `PreflightChecklist` disables the primary button |
| Visual | Storybook + Chromatic | starred components in `02 §5`, at 390/834/1280 |
| E2E | Playwright | (1) template post → publish → visible on `/blog`; (2) blank post → blocks → schedule → cron → live; (3) upload → alt text → insert → publish; (4) two-tab 409; (5) unpublish → 410; (6) keyboard-only editor pass |
| Budgets | Lighthouse CI | index + post, mobile profile, fails under 95 |

**Preview-parity test (the one that matters):** render a fixture draft through `PreviewFrame` and through the public route, and assert the two HTML trees match. This is what keeps "what I see is what ships" true.

---

## 11. Risks

| Risk | Mitigation |
| --- | --- |
| Next migration slips | Phase 1 and 2 don't depend on the marketing pages; ship the blog first under `/blog`, migrate the rest after. |
| Two rendering paths drift | One `BlockRenderer`, enforced by the preview-parity test. |
| Custom mode grows into a page builder | Block list is closed (12 types); layout stays the site's, not the author's. No columns, no spacers, no colour pickers. |
| Card catalogue coupling | Card block stores a reference only; a missing card degrades to nothing plus an advisory check. |
| Scheduling in a files driver | Postgres from day one for scheduling; the files driver stays a dev/fallback path. |
| Solo-admin assumptions leak into the schema | `authorId`, `version` and revisions exist now, so multi-author is additive. |

---

## 12. Definition of done (launch)

Every P0 in `04` passes its acceptance test · Lighthouse ≥ 95 mobile on `/blog` and a post · Axe clean on all six screens · the six Playwright journeys green · preview-parity test green · one real post per template published · `github.md` screen map updated.
