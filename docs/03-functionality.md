# 03 · Functionality

What the system does, precisely enough to build against. Contracts first, then behaviour per surface.

---

## 1. Content model

All types are plain JSON so the storage adapter (§4) can be files, Postgres or a hosted CMS without touching a screen.

### 1.1 Post

```ts
type PostStatus = 'draft' | 'scheduled' | 'published' | 'unpublished' | 'trash';
type EditorMode = 'template' | 'custom';

interface Post {
  id: string;                 // cuid
  slug: string;               // kebab-case, unique across non-trashed
  status: PostStatus;
  mode: EditorMode;
  templateId: string | null;  // 'how-to' | 'listicle' | … | null when blank/custom

  title: string;              // ≤ 120 chars
  excerpt: string;            // 60–160 chars, used on index + as meta description fallback
  categoryId: string;
  authorId: string;
  tags: string[];             // optional, no dedicated UI at launch

  hero: ImageRef | null;

  // exactly one of these is authoritative, decided by `mode`
  sections: Record<string, SlotValue> | null;  // template mode
  blocks: Block[] | null;                      // custom mode

  seo: {
    title?: string;           // ≤ 60 advised
    description?: string;
    ogImage?: ImageRef;       // defaults to hero
    canonicalUrl?: string;
    noindex?: boolean;
  };

  publishedAt: string | null; // ISO, immutable after first publish
  scheduledFor: string | null;
  updatedAt: string;
  createdAt: string;
  version: number;            // optimistic concurrency

  readingTimeMinutes: number; // derived, stored for list/index use
  featured: boolean;          // pins to the index hero slot
}

interface ImageRef {
  mediaId: string;
  alt: string;                // required before publish
  focal?: { x: number; y: number }; // 0–1, default {x:.5,y:.5}
  caption?: string;
}
```

### 1.2 Blocks

```ts
type Block =
  | { id: string; type: 'heading';  data: { level: 2|3; text: string } }
  | { id: string; type: 'text';     data: { html: string } }           // sanitised subset
  | { id: string; type: 'image';    data: { image: ImageRef; width: 'inline'|'wide'|'full' } }
  | { id: string; type: 'quote';    data: { text: string; attribution?: string } }
  | { id: string; type: 'steps';    data: { items: { id: string; title: string; body: string }[] } }
  | { id: string; type: 'list';     data: { style: 'bullet'|'number'; items: string[] } }
  | { id: string; type: 'table';    data: { head: string[]; rows: string[][] } }
  | { id: string; type: 'card';     data: { cardId: string; layout: 'row'|'stack'|'wide';
                                            show: { fee: boolean; credits: boolean; applyLink: boolean; disclosure: boolean } } }
  | { id: string; type: 'callout';  data: { tone: 'info'|'warn'; text: string } }
  | { id: string; type: 'cta';      data: { heading: string; body?: string; label: string; href: string; tone: 'ink'|'forest' } }
  | { id: string; type: 'embed';    data: { provider: 'youtube'|'x'|'generic'; url: string } }
  | { id: string; type: 'divider';  data: {} };
```

Rich text (`text.html`) allows only `p, strong, em, a[href], code, ul, ol, li, br`. Everything else is stripped on save, server-side.

### 1.3 Template

```ts
interface Template {
  id: string;
  name: string;
  purpose: string;             // one line, shown in the gallery
  slots: Slot[];
  toBlocks(sections: Record<string, SlotValue>): Block[];
  matches(blocks: Block[]): boolean;   // enables Custom → Template
}

interface Slot {
  key: string;
  label: string;
  hint?: string;               // the guidance line under the label
  kind: 'text' | 'richtext' | 'image' | 'quote' | 'steps' | 'card' | 'cta' | 'table';
  required: boolean;
  repeatable?: { min: number; max: number };
  maxChars?: number;
}
```

Seven templates ship: `how-to`, `listicle`, `card-review`, `product-update`, `customer-story`, `news`, `essay`. Each is one file in `src/blog/templates/`, registered in `templateRegistry.js`.

### 1.4 Media, Category, Author, Settings

```ts
interface Media {
  id: string; filename: string; mime: string; bytes: number;
  width: number; height: number; blurhash: string;
  variants: { w640: string; w1280: string; w2400: string };
  alt: string; folder: string | null;
  usedIn: string[];            // post ids, derived
  createdAt: string;
}

interface Category { id: string; name: string; slug: string; description?: string; order: number }
interface Author   { id: string; name: string; role: string; bio: string; avatar?: ImageRef; links?: Record<string,string> }

interface BlogSettings {
  title: string; standfirst: string; basePath: string; postsPerPage: number;
  defaultAuthorId: string;
  seo: { titleTemplate: string; defaultOgImage?: ImageRef; twitterHandle?: string };
  newsletter: { enabled: boolean; provider: 'resend'|'buttondown'|'none'; listId?: string };
}
```

---

## 2. API surface

REST, all under `/api/studio/*` (auth required) and `/api/public/*` (open, cached). Every mutation returns the full updated entity plus the new `version`.

| Method | Path | Body / params | Returns | Notes |
| --- | --- | --- | --- | --- |
| GET | `/api/studio/posts` | `status, q, category, sort, page` | `{items, total, counts}` | `counts` powers the filter chips and stat cards |
| POST | `/api/studio/posts` | `{mode, templateId?}` | `Post` | creates a `draft` |
| GET | `/api/studio/posts/:id` | — | `Post` | |
| PATCH | `/api/studio/posts/:id` | partial `Post` + `version` | `Post` | autosave target; 409 on version mismatch |
| POST | `/api/studio/posts/:id/publish` | `{when: 'now'\|ISO, alsoDo}` | `{post, checks}` | re-validates server-side; 422 with `checks` on failure |
| POST | `/api/studio/posts/:id/unpublish` | — | `Post` | |
| POST | `/api/studio/posts/:id/duplicate` | — | `Post` | title + " (copy)", fresh slug, `draft` |
| POST | `/api/studio/posts/:id/mode` | `{to:'custom'\|'template'}` | `Post` | runs `toBlocks`/`matches` |
| DELETE | `/api/studio/posts/:id` | — | `Post` | → `trash` |
| POST | `/api/studio/posts/:id/restore` | — | `Post` | |
| POST | `/api/studio/posts/:id/preview-token` | — | `{token, url, expiresAt}` | |
| GET | `/api/studio/posts/:id/preflight` | — | `Check[]` | same evaluator the sheet uses |
| GET | `/api/studio/media` | `q, folder, page` | `{items,total}` | |
| POST | `/api/studio/media` | multipart | `Media` | derives variants + blurhash |
| PATCH | `/api/studio/media/:id` | `{alt, folder, filename}` | `Media` | |
| DELETE | `/api/studio/media/:id` | — | `204` | 409 if `usedIn` non-empty |
| GET/PUT | `/api/studio/settings` | `BlogSettings` | `BlogSettings` | |
| GET/POST/PATCH/DELETE | `/api/studio/categories(/:id)` | `Category` | | DELETE takes `?reassignTo=` |
| GET | `/api/studio/cards` | `q` | `Card[]` | read-only catalogue for the Card block |
| POST | `/api/cron/publish-due` | — | `{published: string[]}` | secret header; idempotent |
| GET | `/api/public/posts` | `category, page` | `{items,total}` | only `published` |
| GET | `/api/public/posts/:slug` | `preview?` | `Post` | 404 unpublished unless valid token |
| POST | `/api/public/subscribe` | `{email, source}` | `202` | rate-limited, double opt-in |

Caching: public GETs are ISR/`revalidate: 300` plus tag-based invalidation on publish (`blog-index`, `post:<slug>`, `category:<slug>`, `sitemap`).

---

## 3. Behaviour per surface

### 3.1 Posts list
- Server-paginated, 25 per page. `q` matches title + slug. Sort: recently edited (default), published date, reads.
- Filter chips read from `counts`, so numbers never disagree with the rows.
- Row menu: Edit · Duplicate · Copy URL · View live (published only) · Edit schedule (scheduled) · Unpublish (published) · Move to trash.
- Bulk selection is out of scope at launch (single admin).
- Optimistic mutations with a 6 s `Undo` toast for trash/unpublish/cancel-schedule.

### 3.2 Editor — shared
- **Autosave**: debounce 800 ms, coalesce into one PATCH, send only changed keys + `version`. `SaveState` shows `Saving… → Saved 12:04 → Not saved · Retry`.
- **Local safety net**: every successful local mutation mirrors to `localStorage['studio:draft:'+id]`; on load, if the local copy is newer than the server's `updatedAt`, show `Restore unsaved changes / Discard`.
- **Concurrency**: 409 → dialog `This post changed elsewhere` with `Reload` / `Overwrite`.
- **Undo/redo**: in-memory stack of the last 50 content mutations, `⌘Z` / `⇧⌘Z`, cleared on reload.
- **Keyboard**: `⌘S` force save · `⌘⏎` publish sheet · `Esc` deselect/close · `⌘↑/↓` move block · `⌘D` duplicate block · `/` open palette (custom mode).
- **Mode switch** lives in the top bar; rules in `01-flow.md` §6.

### 3.3 Editor — template mode
- Left `SlotForm` renders one field per `Slot`, in template order; required slots marked, optional ones say so.
- Repeatable slots (`steps`, listicle entries) support add / remove / drag-reorder with a `min`/`max` guard; numbering is automatic and never editable.
- Character counters appear only where `maxChars` is set (title, excerpt).
- Right `PreviewFrame` renders the **public** page component from the current draft, debounced 250 ms, at 1280 / 834 / 390 CSS px. Empty slots are skipped by the renderer, so the preview is always a legal page.
- Slot progress (`5 of 7 slots`) is informational; only pre-flight blocks publishing.

### 3.4 Editor — custom mode
- Palette insert: click (appends after selection) or drag (drops at the indicator). `/` opens the same list as a filter box.
- Canvas: click to select, drag handle `⠿` to reorder, `⧉` duplicate, `✕` delete (with undo). Multi-select out of scope.
- Inspector tabs: **Block settings** (fields from `blockRegistry[type].editor`), **Preview** (same `PreviewFrame`), **SEO** (`SeoPanel`).
- `PostDetailsCard` (slug, category, excerpt) stays docked below the tabs so no field needs a separate screen.
- Outline list mirrors the block order and scrolls the canvas on click.
- Card block: `cardId` is a reference, never a copy — fee/credit figures re-read from the catalogue at render time, so a catalogue change updates every post at once. A missing `cardId` renders nothing publicly and raises an advisory check.

### 3.5 Media
- Upload: client validates type (`jpeg/png/webp`) and size (≤ 8 MB) before POST; server generates three widths + blurhash; optimistic tile shows progress.
- Alt text is required to insert into a post; the detail panel focuses the alt field for any image without one.
- Picker mode returns `{mediaId, alt, focal}` to the calling slot/block.
- Delete is blocked while `usedIn` is non-empty, with the list of posts shown.

### 3.6 Publish
- Pre-flight runs the shared evaluator (`src/blog/preflight.js`) so the sheet, the API and the cron job agree. Blocking failures disable the primary button and each row offers an inline fix that focuses the offending field.
- `Publish now` sets `status: 'published'`, `publishedAt = now` (first time only), revalidates tags, fires the `alsoDo` jobs.
- `Schedule` requires `scheduledFor ≥ now + 5 min`; the cron endpoint publishes anything due, idempotently.
- Editing a published post writes a revision; `Update live` promotes it and revalidates, `Discard` drops it.

### 3.7 Public rendering
- `/blog` and `/blog/[slug]` are statically generated with `revalidate: 300` and `generateStaticParams` over published slugs; publish invalidates by tag so a new post is live within seconds without a deploy.
- `ArticleBody` maps `blocks` (or `template.toBlocks(sections)`) through `BlockRenderer`; template and custom posts share one rendering path, guaranteeing preview parity.
- `TableOfContents` derives from `heading` blocks / template headings at build time — no client scraping.
- `ReadingProgress` uses one `requestAnimationFrame`-throttled scroll listener on the article element; `minutes left` = `readingTimeMinutes × (1 − progress)`, rounded up.
- Images: `next/image` with the three variants, `sizes` per context, blurhash placeholder, `loading="lazy"` except the hero.
- Metadata per post: title (`seo.title ?? title`), description (`seo.description ?? excerpt`), canonical, OG/Twitter card from `seo.ogImage ?? hero`, `article:published_time`, JSON-LD `BlogPosting` (+ `HowTo` for the how-to template).
- `sitemap.xml` and `rss.xml` generated from published posts; `noindex` posts excluded.
- 404 for never-published slugs, 410 + the same page for unpublished ones.

---

## 4. Storage adapter

One interface, three possible implementations, chosen by env (`CONTENT_DRIVER=files|postgres|cms`). No screen or component imports a driver directly.

```ts
interface ContentStore {
  listPosts(q: PostQuery): Promise<{items: Post[]; total: number; counts: StatusCounts}>;
  getPost(idOrSlug: string): Promise<Post | null>;
  createPost(input: Partial<Post>): Promise<Post>;
  updatePost(id: string, patch: Partial<Post>, version: number): Promise<Post>;   // throws Conflict
  deletePost(id: string, hard?: boolean): Promise<void>;
  listMedia(q: MediaQuery): Promise<{items: Media[]; total: number}>;
  putMedia(file: Upload): Promise<Media>;
  updateMedia(id: string, patch: Partial<Media>): Promise<Media>;
  deleteMedia(id: string): Promise<void>;
  getSettings(): Promise<BlogSettings>;
  putSettings(s: BlogSettings): Promise<BlogSettings>;
  listCategories(): Promise<Category[]>;
  putCategory(c: Category): Promise<Category>;
  deleteCategory(id: string, reassignTo?: string): Promise<void>;
}
```

- **files** — MDX/JSON under `content/posts/*.json`, media in `public/uploads`. Zero infra; commits are the audit log. Scheduling needs a cron that commits, so it suits a solo writer with a repo.
- **postgres** (Supabase/Neon) — one `posts` table with a `jsonb` body, `media`, `categories`, `settings`. Real scheduling, real concurrency. **Recommended default.**
- **cms** — Sanity/Payload; the adapter maps documents to the same shapes.

---

## 5. Auth & security

- Studio behind a single provider (NextAuth email magic link, or Clerk). Middleware protects `/studio/*` and `/api/studio/*`.
- Server-side role check on every mutation, not just the middleware.
- Preview tokens: signed, single-post, 7-day expiry, `X-Robots-Tag: noindex`.
- HTML sanitisation server-side on save and again at render.
- Uploads: MIME sniffed server-side, re-encoded, filenames randomised, served from a CDN path.
- Rate limits: subscribe (5/min/IP), uploads (30/min), publish (10/min).
- Cron endpoint requires a secret header and is idempotent.

---

## 6. Performance budgets

| Surface | Budget |
| --- | --- |
| `/blog` | LCP < 1.8 s on 4G, CLS < 0.05, JS < 90 KB gzip |
| `/blog/[slug]` | LCP < 2.0 s, JS < 110 KB gzip (progress + TOC are the only client components) |
| Studio editor | first interaction < 2.5 s; preview re-render < 120 ms; autosave round-trip < 400 ms p50 |

Public pages ship as server components except `ReadingProgress`, `CategoryChips` (when filtering client-side), `NewsletterPatch` and `ShareRow`.
