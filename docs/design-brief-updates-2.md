# Alivia — design prompt, round 4 (updates from round 2 of live testing)

Paste everything below into the same Claude.ai conversation used for rounds 1–3 (or a new one,
pasting the design tokens below for context). **Also attach/paste the three current design files**
— `Alivia Prototype.dc.html`, `Alivia Panel Prototype.dc.html`, and `Alivia.dc.html` — since this
round edits existing screens rather than adding new ones, and the conversation needs their actual
current markup to work from.

---

## Continuing an existing design — this round is fixes, not new screens

**Alivia**'s public patient site, the Doctor/Assistant panel, and Admin were all already designed in
three previous rounds. This round doesn't add any new screens — it's ten specific fixes and changes
found by a second pass of actually clicking through the built product (see
`docs/exploration-findings-2.md` for the full investigation behind each one). Match the established
visual language exactly — same colors, type, shape language, spacing, and icon treatment as
everywhere else. Do not introduce new tokens, fonts, or a different shape language except where a
change explicitly calls for a deliberate one-off (called out individually below). Only touch what's
listed in the ten items below — leave every other screen exactly as currently specified.

### Design tokens already established (reuse exactly)

**Colors**

| Token                | Hex                   | Usage                                                     |
| -------------------- | --------------------- | --------------------------------------------------------- |
| Cream (background)   | `#FBF6EF`             | App/page background                                       |
| Surface white        | `#FFFFFF`             | Cards, result rows, inputs                                |
| Terracotta (primary) | `#E8785A`             | Primary buttons, logo mark, active accents                |
| Terracotta text      | `#C15A3E`             | Links, specialty label, primary-outline text              |
| Terracotta hover     | `#B04A30`             | Link hover                                                |
| Terracotta disabled  | `#EAD9CF`             | Disabled primary button fill                              |
| Green (secondary)    | `#3E6B5C`             | "Attended" action button, avatar tint                     |
| Green deep text      | `#2F5C4C`             | "Next available" pill text, attended stat                 |
| Green dot            | `#4F9C82`             | Availability dot (today)                                  |
| Green pill bg        | `#E7F0EA`             | "Next available" pill bg, verified badge, success icon bg |
| WhatsApp green       | `#25A566`             | WhatsApp send button only                                 |
| Sand                 | `#D8CBB4`             | Neutral accent                                            |
| Sand dot             | `#C9BCA5`             | Availability dot (not-today)                              |
| Ink (text)           | `#2A2521`             | Primary text, dark surfaces (toolbar, dashboard nav)      |
| Muted text           | `#8A8175`             | Secondary text, captions                                  |
| Body text soft       | `#5C554C`             | Paragraph body, chip labels                               |
| Border               | `#EEE6DA` / `#E7DFD3` | Card borders / input+chip borders                         |
| Hairline             | `#F0E9DE` / `#F7F2EA` | Inner dividers, subtle bg tints                           |
| Error bg / text      | `#F9E4DC` / `#B04A30` | Error banners (e.g. login error)                          |
| Warning bg / text    | `#FCF3E8` / `#9A7B3E` | Warning/override notices (e.g. over-capacity)             |

**Typography:** Hanken Grotesk (Google Fonts), weights 400–800, fallback `system-ui, sans-serif`.
Page H1 34px/800 (hero), 26px/800 (screen titles); section heading 15–16px/700; body 14–15px/400–500,
line-height ~1.65; secondary/caption 12–13px/500 muted; buttons 13–15px/700.

**Shape/spacing:** buttons & pills `999px` radius; cards/inputs `14–22px`; avatars `999px`. Card
shadow `0 18px 50px rgba(42,37,33,.08–.12)` (framed), `0 4px 16px rgba(42,37,33,.05)` (search bar).
App cards use border-only, no shadow. Card padding 16–24px; screen horizontal padding 24px.

**Icons:** placeholder Unicode glyphs only (`⌕` search, `✓` check, `✆` phone/WhatsApp, `⌂` location,
`↓` sort, `←` back, `▾` dropdown chevron). No new icon set is being introduced in this round either —
use the same placeholder-glyph approach for anything new below (e.g. an eye/show-password glyph).

---

## 1. Home + Results — merge into one page, keep the specialty in the URL

**File:** `Alivia Prototype.dc.html` (Home / Results screens).

**Current state:** the design already models Home and Results as a single-page screen router
(`screen: 'home' | 'results' | ...` swapped via `setState`, not a URL/route change) — this part is
already correct and matches what we want. What's missing is any note that the active
specialty/search term should also be reflected in the URL, so a filtered view stays
shareable/bookmarkable.

**Change:** no layout or markup change needed to the screens themselves. Add a short behavior note
(in the screen's comments or wherever the `screen` state model is documented in the file) that
picking a specialty chip or submitting the search updates the visible list in place **and** syncs
the active specialty/search term into the URL as a query param — the in-place update stays exactly
as designed, this only adds the URL-sync detail on top of it. There is no more separate "Results"
destination to design a "back" affordance for — refining a search is inherently in place since the
search bar and chips already live on this one page.

---

## 2. Doctor profile page — drop the two-column split, stack everything full-width

**File:** `Alivia Prototype.dc.html` (Doctor profile screen).

**Current state:** the profile card below the doctor header is a two-column split — left column
"Sobre el doctor" (bio), right column stacking the calendar and the slot grid. Because the bio is
short and the calendar+slots are much taller, the left column ends up mostly empty at desktop widths.

**Change:** drop the two-column layout entirely, at every screen width — not just mobile. "Sobre el
doctor" becomes a full-width block at the top of the card. Below it, full-width too, the calendar
(kept at its current **compact** size, left-aligned — it shouldn't stretch to fill the new width)
followed by the "Elige un horario" slot grid, which stays at its current **3 columns** (just with
more horizontal breathing room from the extra width, not more/larger buttons per row).

---

## 3. App-wide — a page-transition fade and per-screen loading skeletons

**File(s):** all three: `Alivia Prototype.dc.html`, `Alivia Panel Prototype.dc.html`, `Alivia.dc.html`
(plus `design/README.md`, since static mockups can't really model transient states like these).

**Current state:** no page-transition animation and no loading-skeleton state exists anywhere across
any of the three surfaces (patient site, panel, admin).

**Change:** this is mainly a written-behavior addition rather than a markup change, since a static
`.dc.html` mockup doesn't have a natural way to show an in-between state:

- Document a simple **fade** transition that plays on every route change, across all screens on all
  three surfaces — nothing more elaborate (no slide, no scale), and no new animation library implied.
- Document that every screen gets its own **loading skeleton**, shaped to match that screen's actual
  content (e.g. a list-of-cards skeleton for Results, a bio-block + calendar + slot-grid shape for
  Doctor Profile, row-skeletons for panel/admin table-style screens) — not one generic spinner reused
  everywhere. If a representative skeleton mockup is useful as a visual reference, one example (e.g.
  for the Results list) is enough to establish the pattern; it doesn't need to be drawn for all 21
  screens individually.

---

## 4. Login page — add a show/hide toggle to the password field

**File:** `Alivia Panel Prototype.dc.html` (login screen).

**Current state:** the "Contraseña" field is a bare password input with no way to reveal the typed
value.

**Change:** add an eye-glyph toggle inside the password field (right-aligned, following the same
placeholder-glyph icon convention used everywhere else — e.g. a simple character that swaps between a
"show" and "hide" state on click). Note in the surrounding spec that this same toggle should be
assumed for the future `/set-password` screen once that gets designed, so it isn't redesigned from
scratch later.

---

## 5. Phone-number country-code dropdown — replace the bare native arrow with a styled chevron

**File(s):** `Alivia Prototype.dc.html` (Booking screen) and `Alivia Panel Prototype.dc.html` (the
"+ Agregar cita" walk-in form, and both the doctor and assistant phone fields on the Crear consulta
screen) — all four country-code `<select>` instances.

**Current state:** the flag + dial-code dropdown (e.g. "🇧🇴 +591") relies entirely on the browser/OS's
own default `<select>` arrow — cramped against the dial-code text, with no custom styling or spacing
reserved for it.

**Change:** style all four instances with a custom dropdown-glyph chevron (`▾`-style), matching the
existing chevron treatment already used on the panel's user/role menu — small triangle glyph, its own
margin from the preceding text, `appearance-none` look (no native arrow visible). This should read as
one consistent component repeated in all four places, not four separate one-off treatments.

---

## 6. Citas queue — rename "Atendió" to "Asistió", and hide attended/no-show until the appointment time has passed

**File(s):** `Alivia Panel Prototype.dc.html`, `Alivia.dc.html`, `Alivia Prototype.dc.html` (every
occurrence of the Citas/Agenda action buttons and status pill).

**Current state:** the two action buttons are "Atendió" (verb family _atender_) and "No asistió"
(verb family _asistir_), with the resulting status pill reading "Atendido" — an inconsistent verb
family between the two actions. Separately, both buttons are always available the instant an
appointment is created, with no check against whether the appointment's scheduled time has actually
passed yet.

**Changes:**

- Rename **"Atendió" → "Asistió"** everywhere it appears, and the resulting status pill from
  **"Atendido" → "Asistió"** too, so the button and the status it produces share the same verb family
  as "No asistió".
- Add a future-time guard to the `setStatus`/button-rendering logic: the "Asistió"/"No asistió"
  buttons are **hidden entirely** (not shown disabled) for any appointment whose scheduled date+time
  hasn't passed yet. Only "Cancelar" remains visible for a future appointment — the attended/no-show
  buttons appear once the scheduled time has actually passed.

---

## 7. Panel + Admin — add a confirmation step to every destructive action

**File:** `Alivia Panel Prototype.dc.html` (all screens listed below).

**Current state:** most destructive actions fire immediately on a single click, with no "are you
sure?" step — **Cancelar** (Citas/Agenda), **Canceló** (Confirmaciones), **Desactivar/Reactivar**
account (Admin), **Restablecer contraseña** (Admin), **Quitar** (Vacation), **Quitar** (Location with
0 schedule blocks), and **Quitar** (Schedule block) all currently execute on the first click. Two
existing patterns already do have a confirm step, but each is a hand-rolled one-off: the impersonation
modal ("Iniciar sesión como…", a real overlay) and the Location-with-blocks removal (currently only a
dead-end `alert('...(demo)')`, even though the written spec already calls for a real confirmation
modal there).

**Change:** design one shared, reusable confirmation-modal component — title, body copy explaining
what will happen, and Confirmar/Cancelar buttons, styled like the app's existing small "framed" cards
(white background, existing border/radius tokens, the framed card shadow) — and apply it to all 9
destructive actions total: the 7 listed above that currently have no confirm step at all, plus the
impersonation modal and the Location-with-blocks removal, both restyled onto this same shared
component instead of their current one-off treatments. The patient-facing cancel flow
(`/cancel/[token]`) is unaffected — it's already its own dedicated confirm page and doesn't need this
component.

---

## 8. Confirmaciones queue — drop cancelled appointments from the list entirely

**File:** `Alivia Panel Prototype.dc.html` (Confirmaciones screen).

**Current state:** a cancelled appointment stays visible in the list with a "Canceló" pill instead of
disappearing — the demo's `patientCancel` logic flips the row's status in place but never removes it
from the rendered array.

**Change:** filter cancelled appointments out of the rendered Confirmaciones list entirely — once an
appointment is cancelled, it should no longer occupy a row on this screen at all. A confirmed
appointment ("✓ Confirmó") is unaffected and keeps rendering exactly as it does today; only the
cancelled case is removed from view.

---

## 9. Horarios — replace the native time input with a custom hour/minute control

**File:** `Alivia Panel Prototype.dc.html` (schedule-block form, "Hora de inicio"/"Hora de fin").

**Current state:** the design currently specifies a single free-text time-range field (e.g.
`placeholder="Horario (8:00–12:00)"`) parsed by splitting on a dash — not the two separate structured
fields the build actually uses.

**Change:** design two separate, structured controls — "Hora de inicio" and "Hora de fin" — each a
custom-styled hour/minute dropdown (matching the app's design system), replacing both the old
free-text field and any native OS time-picker look. This needs a real visual design pass, since
neither the current free-text field nor a native time input is being kept — follow the same rationale
already used for the custom calendar control built for the Doctor Profile date picker (round 1): a
native/generic control doesn't match Alivia's pill-based design language, so a bespoke one is worth
the one-off treatment.

---

## 10. Vacaciones — add an "Editar" action, and an overlap error state

**File:** `Alivia Panel Prototype.dc.html` (Vacaciones screen).

**Current state:** each vacation entry only has a "Quitar" button — no way to edit an existing
period. Separately, `addVacation()` only validates that the entry's own dates are well-formed; it
never checks a new or edited period against the doctor's other existing vacation periods, so two
periods can overlap for the same location (or against an "all locations" entry) with no warning.

**Changes:**

- Add an **"Editar"** button next to "Quitar" on each vacation entry, matching the Schedule editor's
  existing Editar/Quitar pair — clicking it reopens the Ubicación/Desde/Hasta form pre-filled with
  that entry's values. Gate it with the same rule already used for "Quitar": only editable **before**
  the period starts.
- Add an overlap **error state** to `addVacation()` (and its new edit equivalent): when a new or
  edited period's date range intersects an existing one for the same location, or against an "all
  locations" entry on either side, reject the save and show an inline error explaining that the doctor
  already has a vacation period overlapping those dates — reusing the same red-tinted error tokens
  (`#F9E4DC` bg / `#B04A30` text) already used for the analogous schedule-block overlap error, rather
  than inventing new ones.

---

## When you're done

Please also update the relevant entries in the existing design README's "Screens / Views" section
(the write-up engineers reference when translating these files into the actual app) so the written
spec matches the ten changes above — not just the `.dc.html` files themselves. In particular:
`design/README.md`'s Home/Results description (item 1), the Doctor Profile layout description
(item 2), the Vacation flowchart cross-reference in `docs/flows/doctor-assistant-panel.md` (item 10,
to add the `Editar` branch and note the overlap rule the same way Schedule is already documented), and
the overlap-validation sentence in `design/README.md` that's currently scoped to "a schedule block"
only (item 10, to extend it to Vacation too).
