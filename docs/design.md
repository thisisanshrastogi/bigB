# Design
Design tokens are lifted from the live site (`tailwind.config.js`, `src/index.css`), so the studio and the blog sit inside the existing brand with no new palette.



### Colour
| Token | Hex | Use |
| --- | --- | --- |
| `paper` / `bg` | `#F5F2EA` | page ground |
| `surface` | `#FFFFFF` | cards, rails, nav pill |
| `surface-sunken` | `#EFEBE1` | canvas behind the editor page, preview gutters |
| `ink` | `#171613` | primary text, primary buttons |
| `accent` | `#2C4035` | forest — links, active nav, numbered steps, tinted panels |
| `accent-tint` | `#E7EDE9` | accent fills behind text/tags |
| `highlight` | `#8DC4AC` | mint — progress, success dots, secondary CTA on dark |
| `muted` | `#6B6658` | secondary text |
| `muted-soft` | `#8A8375` | tertiary/meta text |
| `border` | `#E2DFD5` | hairlines |
| `border-strong` | `#D6CFBF` | input borders |
| `warn-bg` / `warn-ink` | `#F3E7D8` / `#8A5A2B` | advisory states, draft pills |

Contrast: body copy uses `ink` or `#3A3730` on paper/surface. `muted-soft` is reserved for ≥ 13px meta text only. Never set body copy in `accent` on paper — use `#2C4035` at 15px+ semibold or larger.

### Type
- Display / headings: **Lora** 400–600 (already loaded site-wide). Post titles, section heads, stat figures.
- UI / body: **Plus Jakarta Sans** 300–800.
- Editorial body copy on the public post page is Plus Jakarta Sans at 18–21px / 1.8, not Lora — Lora is for headings and quotes.

| Role | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Post H1 (Lora) | 64/1.02 | 48/1.06 | 34/1.1 |
| Index hero (Lora) | 60/1.04 | 44/1.08 | 32/1.12 |
| Section H2 (Lora) | 30/1.2 | 27/1.2 | 24/1.25 |
| Card title (Lora) | 26/1.25 | 23/1.28 | 21/1.3 |
| Lead paragraph | 21/1.75 | 19/1.75 | 18/1.7 |
| Body | 18/1.8 | 17/1.8 | 17/1.75 |
| Meta | 13–14 | 13 | 13 |
| Studio UI base | 14 | — | — |

### Space, radius, elevation
- Spacing scale: `4 · 8 · 12 · 16 · 22 · 28 · 36 · 48 · 64 · 88`.
- Radius: `9` (small controls) · `14` (inputs, tiles) · `18–22` (cards) · `28` (large containers) · `999` (buttons, pills, chips, inputs on the public site).
- Elevation: `sm 0 1px 2px rgba(46,43,37,.10)` · `md 0 3px 10px rgba(46,43,37,.10)` · `lg 0 12px 32px rgba(46,43,37,.18)`.
- Images: always rounded (`18–24`), always `filter: saturate(.78) contrast(.95)` so photography sits back into the paper ground. Aspect ratios: hero `16/9` (mobile `4/3`), card `3/2`, media tile `1/1`.

### Motion
150 ms `ease-out` for hovers/tints, 220 ms for panel and dialog entrances, 320 ms for the publish sheet. Reduced-motion: opacity only.

### Interaction states (all interactive elements)
- hover: 1 tint step (`ink` → 88% opacity; outlined → `accent-tint` fill)
- active: 1 step past base (`#223228` for accent fills)
- focus-visible: `outline: 2px solid #2C4035; outline-offset: 2px` — never the browser default
- disabled: 45% opacity, no pointer events

---

## 2. Breakpoints

| Name | Range | Public blog | Studio |
| --- | --- | --- | --- |
| `sm` | < 640 | single column, 20px gutters | read-only: posts list + publish; editing redirects to a "use a larger screen" card with a preview link |
| `md` | 640–1023 | single column, 32px gutters, 2-up card grid | posts/media usable, editor is preview-first with a bottom sheet for fields |
| `lg` | 1024–1439 | 3-up grid, sticky contents rail appears | full studio; rails narrow (palette 180, inspector 380) |
| `xl` | ≥ 1440 | max content width 1240, article column 696 | full studio at the widths in the boards |

Container: `width:100%; max-width:1240px; margin-inline:auto; padding-inline:clamp(20px,5vw,76px)`.
Article measure: `max-width:696px` — never wider, never a fixed px width below `lg`.

---

