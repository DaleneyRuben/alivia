# Exploration Findings & Action Items — Round 2

A running log from manually exploring the live app (see `docs/user-guide.md` for the screen-by-screen
reference). Add an entry here anytime something looks surprising, broken, or missing while clicking
through — I'll investigate each one against the actual code, the `./design` source-of-truth, and
existing docs/ADRs before we agree on an action item, so nothing gets "fixed" based on a guess.

**This is a documentation-only session.** Nothing here gets implemented, and `./design` doesn't get
touched, while exploration is still in progress. Once everything's been walked through, these
findings get consolidated into a single prompt for the design AI, which is what actually updates
`./design`, adds backlog items, etc. This doc's job until then is only to capture findings and the
decisions/open questions attached to each one.

This is a second, separate round from `docs/exploration-findings.md` (round 1, fully resolved) —
numbering restarts at 1 for this round's own findings.

## How an entry gets resolved

1. You report what you saw and where.
2. I check whether it's a real gap (in code, in `./design`, or both) or expected behavior, and say which.
3. Any open design/product questions get resolved here, in writing — as a decision, not a change.
4. Once exploration wraps, all entries get bundled into a design-AI prompt to actually execute
   (design updates, backlog items, then implementation) — nothing before that.

## Findings log (summary)

| #   | Area                     | Finding                                                                                                                                                                      | Status  |
| --- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | Home search → Results    | Picking a specialty chip or submitting the search bar navigates to a separate `/results` page instead of filtering in place.                                                 | Decided |
| 2   | Doctor profile page      | Two-column layout ("Sobre el doctor" left, calendar + slots right) leaves the left column mostly empty since the bio is short and the right column is much taller.           | Decided |
| 3   | Whole app                | No page-transition animation and no loading skeletons anywhere — route changes and slow data fetches show no in-between state.                                               | Decided |
| 4   | Login page               | Password field has no show/hide (eye icon) toggle.                                                                                                                           | Decided |
| 5   | Phone input (all 4 uses) | Country-code dropdown's arrow is the bare native browser arrow, cramped against the "+591" text, no custom styling/spacing.                                                  | Decided |
| 6   | Citas (Agenda) queue     | "Atendió" button doesn't match "No asistió"'s verb family; also, no guard stops marking attended/no-show before the appointment's scheduled time has passed.                 | Decided |
| 7   | App-wide (panel + admin) | Most destructive actions (Cancelar, Desactivar/Reactivar, Quitar, etc.) fire immediately on click with no confirmation step — caused an accidental appointment cancellation. | Decided |
| 8   | Confirmaciones queue     | A cancelled appointment stays visible on the list with a "Canceló" pill, instead of dropping off once cancelled.                                                             | Decided |
| 9   | Horarios (schedule form) | "Hora de inicio"/"Hora de fin" use native `type="time"` inputs, popping open an ugly OS-native picker; also a real deviation from the design's single free-text field.       | Decided |
| 10  | Vacaciones               | No way to edit an existing vacation period (Quitar only); also no overlap validation lets two vacation periods conflict for the same location, as seen for August.           | Decided |

---

## 1. Home search/specialty chips navigate to a separate page instead of filtering in place

**Where:** the patient-facing Home page (`/`) — the search input ("Especialidad o nombre del doctor")
with its "Buscar" button, and the specialty quick-filter chips below it (Cardiología, Pediatría,
Dermatología, Medicina general). Screenshotted mid-exploration.

**Investigated:**

- `src/components/patient/SpecialtySearch.tsx` — both the chip `onClick` handlers and the search
  form's `onSubmit` call the same `goToResults(specialty)` helper, which does
  `router.push(\`/results?specialty=${encodeURIComponent(specialty)}\`)`. This is a genuine Next.js
App Router navigation to a different route (`/results`), not a same-page state update or shallow
routing — confirmed no `{ shallow: true }`-equivalent or client-side state swap exists anywhere in
the file, and confirmed in `SpecialtySearch.test.tsx`where both the submit test and the chip-click
test assert`router.push`was called with`/results?specialty=...`.
- `src/app/results/page.tsx` is a Next.js **Server Component** — reads `specialty` from
  `searchParams`, calls `getDoctorDirectory()`, filters server-side via `matchesDoctorQuery`
  (`src/lib/patients/matchesDoctorQuery.ts`), and renders `ResultsList`. Each specialty change is a
  fresh server render of a distinct route, not a client-side re-render of a section on Home.
- `src/components/patient/ResultsList.tsx` has **no search input and no specialty chips at all** —
  its only interactive element is a `<Link href="/">← Volver a inicio</Link>`. So today, refining the
  search once on `/results` means a full navigation back to Home, then another full navigation back
  to `/results`.
- Design source-of-truth (`design/README.md:123` + `design/Alivia Prototype.dc.html`) specifies Home
  and Results as a **single-page screen router**: `screen: 'home' | 'results' | ...` swapped via
  plain `setState` calls (`design/Alivia Prototype.dc.html:426` for the chip handler, `:449` for
  search submit) — never a URL/route change. This is a real gap versus the design, not intentional
  behavior that just wasn't specified.
- No ADR or `CONTEXT.md` text addresses Home/Results routing architecture one way or the other —
  `docs/adr/0012-mvp-tech-stack.md` confirms Next.js App Router as the stack and that most flows are
  "submit-and-confirm rather than live-updating," but doesn't mandate separate routes for search
  results specifically.

**Decided:**

- Home and Results merge into **one single page** — no more `/results` as a separate route. Picking
  a specialty chip or submitting the search bar updates the doctor list in place on the same page,
  matching the design's single-screen-router model.
- The active specialty/search term **stays reflected in the URL** as a query param (e.g.
  `/?specialty=cardiologia`), so a filtered view is still shareable/bookmarkable and the browser back
  button still works — implemented as a URL update alongside the in-place list refresh, not a full
  page navigation.
- Since the search bar and chips already live on this one page, refining the search is inherently
  "in place" — there's no separate Results screen that would need its own copy of the search UI.
  The "← Volver a inicio" affordance goes away entirely since there's nowhere else to go back to.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Prototype.dc.html`'s behavior notes / README to confirm Home and Results
      are one page with an in-place-updating list, and that the active specialty/search reflects in
      the URL (a refinement to the existing `screen` state model, which currently doesn't mention URL
      sync at all).
- [ ] Add a backlog item in `docs/backlog.md` for this change.
- [ ] Implement: fold `/results` into `/` (or make `/results` the canonical single page and redirect
      `/` into it) as a page that reads the specialty from `searchParams` for initial/shareable state,
      renders `SpecialtySearch` and the doctor list together, and updates both the list and the URL
      (via `router.replace`/`router.push` without a full navigation, or client-side state synced to
      the URL) when a chip is clicked or the search is submitted — instead of `SpecialtySearch`
      routing to a separate `ResultsList` page. Remove the now-unnecessary "← Volver a inicio" link
      from `ResultsList.tsx`. Update `SpecialtySearch.test.tsx` and `ResultsList`-related tests
      accordingly.

---

## 2. Doctor profile page — two-column layout leaves the left column mostly empty

**Where:** the patient-facing Doctor Profile page (e.g. `/doctors/[id]`) — the card below the doctor
header. Screenshotted mid-exploration (Dra. Carla Mendoza).

**Investigated:**

- `src/components/patient/DoctorProfile.tsx:81` — the split is a plain
  `grid grid-cols-1 gap-7 ... sm:grid-cols-2`: one column on mobile, two equal-width columns from
  `sm` up, no `items-start`/`items-stretch` or height-compensating logic. Left column (`:82-89`) is
  just an "Sobre el doctor" heading + one `<p>{doctor.bio}</p>`. Right column (`:91-95`) stacks
  `DoctorProfileCalendar` + a heading + `SlotPicker` — three blocks, inherently much taller.
- This matches the design source-of-truth exactly, not a build deviation:
  `design/Alivia Prototype.dc.html:134-156` uses the same
  `grid-template-columns: repeat(auto-fit, minmax(280px,1fr))` split with the identical left/right
  content, and `design/README.md:94-99` documents it in writing the same way, with no mention of
  balancing column heights.
- The imbalance is a side effect of round 1's Finding #4 (`docs/exploration-findings.md:177-246`):
  that change removed the standalone "Ubicaciones" list from the left column (nothing added in its
  place) while adding a whole new calendar widget to the right column — but neither that finding's
  investigation nor its decision addressed the resulting height mismatch between columns.
- Bio content is deliberately short by design: the onboarding field is labeled "Biografía breve" with
  a 3-row textarea (`src/components/panel/onboarding/ProfileForm.tsx:74,78`), and seed data bios
  (`prisma/seed/doctorsData.ts`) are single sentences — around 2 lines at this column width. So this
  isn't a data-entry problem that will fix itself with longer bios; the left column will reliably
  stay short.

**Decided:**

- Drop the two-column split. "Sobre el doctor" moves to full width at the top of the card, with the
  calendar and slot picker stacked below it, also full width — i.e. the layout that's already used on
  mobile (`grid-cols-1`) becomes the layout at all screen widths, not just narrow ones.
- The slot grid stays at its current **3 columns** — just with more horizontal breathing room from
  the extra width, not more/larger buttons per row.
- The calendar widget stays its current **compact size**, left-aligned at the top of the full-width
  section — it doesn't stretch to fill the new width, since it's just a month grid and doesn't
  benefit from growing.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Prototype.dc.html`'s doctor-profile screen (and `design/README.md`'s
      written description at `:94-99`) to a single-column stacked layout: "Sobre el doctor" full
      width on top, calendar (compact, left-aligned) + "Elige un horario" slot grid (still 3 columns)
      below it — replacing the current two-column `auto-fit minmax(280px,1fr)` spec.
- [ ] Add a backlog item in `docs/backlog.md` for this change.
- [ ] Implement: in `DoctorProfile.tsx:81`, remove the `sm:grid-cols-2` split (and the wrapping grid
      entirely, or collapse it to a single-column stack) so the About block, `DoctorProfileCalendar`,
      and `SlotPicker` render in sequence at all breakpoints. No changes expected to
      `SlotPicker.tsx`'s internal `grid-cols-3` or `DoctorProfileCalendar.tsx`'s sizing. Update any
      snapshot/layout-related tests for `DoctorProfile.tsx` if they assert on the grid structure.

---

## 3. No page-transition animation and no loading skeletons anywhere

**Where:** the whole app — 21 distinct routes across the patient site (7), the doctor/assistant panel
(9), and admin (5). Not tied to one screenshot — raised as a general request.

**Investigated:**

- **Page transitions:** nothing exists today. No `framer-motion` dependency in `package.json`, no
  `view-transition`/`AnimatePresence` usage anywhere in `src/`, no `template.tsx` files anywhere under
  `src/app`, `next.config.ts` has no `experimental.viewTransition` flag set, and `globals.css` has no
  `@keyframes`/`transition`/`animate-*` rules. The only `transition:` CSS in the whole project is two
  button hover/active micro-transitions in the design prototype
  (`design/Alivia Prototype.dc.html:80,110`) — unrelated to route changes. The only `useTransition`
  usage in the codebase is React's hook for gating Server Action calls (e.g.
  `src/components/patient/BookingForm.tsx:21`) — it disables buttons during a mutation, it doesn't
  animate anything.
- **Loading skeletons:** also nothing exists today. No `loading.tsx` anywhere under `src/app`, no
  component named `*Skeleton*`, no spinner, no `animate-pulse`/`animate-spin`. Every `page.tsx` except
  `/login` is an `async` Server Component that awaits its data before rendering — there's no
  client-side `useEffect`+fetch or SWR/React Query pattern anywhere for a skeleton to fill after
  mount. Per `docs/adr/0012-mvp-tech-stack.md:7`, this is a deliberate architectural choice ("most of
  this app's flows are submit-and-confirm rather than live-updating... TanStack Query is deferred
  until a specific screen needs client-side caching") — so a skeleton here would only ever be visible
  via a `loading.tsx` Suspense fallback during a slow **server-side** render/fetch, not a client-fetch
  flash.
- Neither `design/Alivia Prototype.dc.html`, `design/Alivia Panel Prototype.dc.html`, nor
  `design/README.md` mention transitions, animations, loading states, or skeletons anywhere (the only
  "transition" hits in the README are unrelated appointment-status transitions, a domain concept, not
  a UI one) — this is genuinely undocumented territory, not a spec gap.
- No existing visual "in-flight" convention to match, beyond the disabled-button-during-`isPending`
  pattern used consistently across ~12 form/editor components.

**Decided:**

- **Page transitions:** a simple fade using Next.js's built-in View Transitions API — no new
  dependency (no Framer Motion). Applies **everywhere**, all 21 routes (patient site, panel, admin
  alike) — not scoped to the patient-facing site only.
- **Loading skeletons:** add a `loading.tsx` per route across **all 21 routes**, each one a skeleton
  matching that page's own layout shape (e.g. Results gets a list-of-cards skeleton, Doctor Profile
  gets the bio-block + calendar + slot-grid shape, panel/admin table-style pages get a row-skeleton),
  not one generic spinner reused everywhere.

**For the eventual design-AI prompt:**

- [ ] Add a note to `design/README.md` (and/or a short new section) documenting the fade transition
      and the per-route skeleton pattern as an app-wide behavior — this isn't visible in the static
      `.dc.html` mockups themselves (they don't model loading states), so it's mainly a written spec
      addition rather than a markup change, unless a representative skeleton mockup is wanted for
      reference.
- [ ] Add a backlog item in `docs/backlog.md` for this change — likely worth splitting into two
      (page-transition fade; per-route loading skeletons), since they touch different mechanisms and
      can ship independently.
- [ ] Implement page transitions: enable Next.js View Transitions (`next.config.ts` experimental flag
      if required by the installed Next version) and add the minimal CSS/markup needed for a fade
      between route changes, applied globally via the root layout so it covers patient site, panel,
      and admin without per-route wiring.
- [ ] Implement skeletons: add a `loading.tsx` next to each of the 21 `page.tsx` files, each rendering
      a skeleton shaped like that page's actual content (reusing shared skeleton primitives — e.g. a
      generic `Skeleton` block/row/card component in `src/components/ui/` — rather than one-off markup
      per route).

---

## 4. Login page — password field has no show/hide toggle

**Where:** the Login page (`/login`) — the "Contraseña" field. Screenshotted mid-exploration.

**Investigated:**

- `src/components/auth/LoginForm.tsx:74-81` — a plain `<input type="password">`, no toggle state
  (the file's only `useState` calls are `email`, `password`, `error`, `submitting`), no icon, and no
  `relative`-positioned wrapper to hang an icon off of. Its class string
  (`w-full border border-input-border bg-white rounded-[14px] px-4 py-[13px] text-sm outline-none focus:border-terracotta`)
  is shared verbatim with the email input directly above it.
- Grepped the whole codebase for `type="password"` — **exactly one match**, this same field. No
  other password input exists anywhere, including no page for the `/set-password` route that
  `src/lib/credentials/buildCredentialSetupLink.ts:32` already generates links for — that route isn't
  built yet (`src/app` has no matching page), so there's no second password field to check for
  precedent either.
- `package.json` has **no icon library** (no lucide-react, heroicons, react-icons, etc.), and
  `grep -rln "<svg" src/` returns zero results. Every existing "icon" in the app is a bare Unicode
  glyph typed directly in JSX — `⚠` (errors, including this same form's own error banner at
  `LoginForm.tsx:47`), `✓` (verified/success), `✆` (phone/WhatsApp), `←` (back), `↓` (sort), `⌕`
  (search), `⌂` (location) — used across `ResultCard.tsx`, `ConfirmationList.tsx`,
  `CreatePracticeForm.tsx`, `ResultsList.tsx`, and others, and asserted directly in tests
  (e.g. `screen.getByRole("link", { name: "✆ WhatsApp" })`). No eye/show-password icon or string
  exists anywhere in `src/` or `design/`.
- Design source-of-truth: `design/Alivia Panel Prototype.dc.html:64` shows the identical bare
  `type="password"` input with no toggle, and `design/README.md:156` (the login screen's written
  description) doesn't mention a show/hide affordance either. `design/README.md:74-75` does note the
  design's icons are "placeholder glyphs only... replace with the codebase's real icon set" — but no
  such icon set has actually been adopted; the codebase still uses bare glyphs everywhere, including
  in this same form. So this isn't a gap versus the design — the design is equally plain — it's a
  net-new addition to both.

**Decided:**

- Add the toggle using a **Unicode glyph** (matching the exact convention every other icon in this
  app already uses), not an inline SVG or a new icon-library dependency.
- Build it as a **reusable `PasswordInput` component** (e.g. `src/components/ui/PasswordInput.tsx`),
  not inlined directly in `LoginForm.tsx` — so the not-yet-built `/set-password` form can reuse the
  same toggle logic later instead of duplicating it.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Panel Prototype.dc.html`'s login screen password field to show the
      eye-glyph toggle (and note the same component should be assumed for the future
      `/set-password` screen once that gets designed).
- [ ] Add a backlog item in `docs/backlog.md` for this change.
- [ ] Implement: `src/components/ui/PasswordInput.tsx` — wraps an `<input>` in a `relative` container,
      toggles `type="password"`/`type="text"` via local state, with an absolutely-positioned glyph
      button (e.g. a plain character toggling between a "show" and "hide" glyph) reusing the existing
      input class string from `LoginForm.tsx:81`. Swap `LoginForm.tsx`'s password `<input>` for
      `<PasswordInput>`, update `LoginForm.test.tsx` accordingly, and add a small test for the new
      component itself.

---

## 5. Phone input country-code dropdown — bare native arrow, cramped against the dial code

**Where:** the shared phone input's country-code `<select>` (flag + dial code, e.g. "🇧🇴 +591"),
used in all four places built in round 1 Finding #3 — Booking, the staff walk-in form, and the
doctor/assistant fields in Crear consulta. Screenshotted mid-exploration (Booking screen).

**Investigated:**

- `src/components/ui/PhoneInput.tsx:47-60` — a plain `<select>` with no `appearance-none`, no
  background-image chevron, no glyph/SVG overlay. The arrow visible in the screenshot is entirely the
  **browser/OS's own default `<select>` decoration** — nothing in this file renders or positions it.
  Padding is a single symmetric `px-3` (12px) applied equally left and right of the flag+dial text
  (`default` variant, `:16`; `compact` variant, `:18`) — there's no separate/larger right-side value
  reserved for arrow breathing room, because there's no arrow element to reserve space for.
- Design source-of-truth matches exactly: all four `<select>` instances across
  `design/Alivia Prototype.dc.html:174` and `design/Alivia Panel Prototype.dc.html:193,441,447` use
  the identical `padding: <v> 12px` shorthand with no `appearance`/background-image/glyph — so this
  isn't a build deviation, the design never specified a styled arrow either.
- The app does already have **one precedent** for a custom dropdown-arrow glyph:
  `src/components/ui/UserMenu.tsx:40` — `<span className="ml-px text-[10px] text-sand-dot">▾</span>`
  — a small triangle character with its own explicit `ml-px` (1px) margin from the preceding label.
  This is a different component (the top-right user/role menu), not currently shared with
  `PhoneInput.tsx`.
- Incidental property mismatch spotted while comparing (unrelated to the arrow, noted for the
  record): the design's walk-in select is `max-width:120px`
  (`design/Alivia Panel Prototype.dc.html:193`) but the built `compact` variant used by
  `ManualAppointmentForm` is `max-w-[128px]` (`PhoneInput.tsx:18`) — 128px matches the create-practice
  design value instead. Not part of this finding's scope, flagging only since it turned up.
- `docs/exploration-findings.md` Finding #3 (the original build of this component) covers country
  list content, E.164 storage, and the shared-component decision — it says nothing about arrow
  styling or spacing.

**Decided:**

- Switch the dropdown to a **custom glyph chevron**, matching the existing `UserMenu.tsx` pattern
  (`appearance-none` on the `<select>` + a small `▾`-style glyph positioned with its own margin) —
  not just wider padding around the unstyled native arrow.
- Applies to all four phone-input instances, since they all share `PhoneInput.tsx`.

**For the eventual design-AI prompt:**

- [ ] Update all four phone-select instances in `design/Alivia Prototype.dc.html` and
      `design/Alivia Panel Prototype.dc.html` to show the custom glyph chevron with proper spacing,
      replacing the current bare native-`<select>` look.
- [ ] Add a backlog item in `docs/backlog.md` for this change.
- [ ] Implement: in `src/components/ui/PhoneInput.tsx`, add `appearance-none` to the `<select>`
      classes, wrap it in a `relative` container, and add a small `▾`-style glyph span (following the
      `UserMenu.tsx:40` pattern) with proper margin/positioning so it reads as an intentional,
      breathing-room'd control rather than the cramped native arrow. Update
      `PhoneInput.test.tsx`/consumer tests if any assert on the select's rendered structure.

---

## 6. Citas queue — "Atendió" copy mismatch, and no future-time guard on attended/no-show

**Where:** the panel's Citas/Agenda screen (`AppointmentList.tsx`, rendered from
`AppointmentsEditor.tsx`) — the three action buttons on each pending row. Screenshotted
mid-exploration (Ruben Daleney, Viernes 24 de julio 11:40, tagged "Siguiente").

**Investigated — two separate issues:**

**(a) Copy mismatch.** `AppointmentList.tsx:98,105` — the two buttons are literally `"Atendió"`
(verb family _atender_) and `"No asistió"` (verb family _asistir_). The resulting status pill
(`:24`) also uses the _atender_ family: `"Atendido"`. Confirmed this is **not a build deviation** —
`design/Alivia Panel Prototype.dc.html:211,669-670` and `design/Alivia.dc.html`/
`design/Alivia Prototype.dc.html` all use the identical two verb families, so the inconsistency
originates in the design source itself. `CONTEXT.md:29`'s glossary only fixes the **English**
canonical terms ("Attended"/"No-show") — it doesn't bear on which Spanish verb family should be
used, so this is purely a Spanish-copy artifact. Separately, `"asistir"` already has an established,
different meaning elsewhere in the app's copy — the day-before Confirmation message
(`src/lib/confirmations/buildConfirmationMessage.ts:26`, `"¿Podrá asistir?"`) — which is presumably
why "No asistió" picked that verb family for the no-show case originally, while "Atendió" didn't
follow suit.

**(b) No future-time guard.** `src/lib/appointments/updateAppointmentStatus.ts:15-25` — the only
validation is doctor ownership and `appointment.status === "SCHEDULED"`. There is no comparison of
the appointment's date/time against the current moment anywhere — not in this server action, not in
`AppointmentsEditor.tsx`'s handlers, and not in `AppointmentList.tsx:56,91`'s button rendering
(gated purely on `pending = status === "SCHEDULED"`). So an appointment scheduled for 6:00pm is fully
markable at 4:00pm today, exactly as reported. **Not a build deviation** — the design's own
`setStatus` function (`design/Alivia Panel Prototype.dc.html:617-624`) has the same gap: no time
value comparison, buttons always wired to fire. But both build and design **contradict the written
domain spec**: `docs/flows/domain-lifecycles.md:24-26` and `CONTEXT.md:29` both explicitly state
Attended/No-show should only be markable "after the [appointment] time has passed" — this rule
exists in writing but is enforced nowhere in either implementation.

- A reusable helper for "has this La Paz local date+time passed" already exists and is used for an
  analogous purpose: `laPazDateTimeToUtc.ts`, called from `getAvailableSlots.ts:63-82` to gate
  patient-facing booking against a minimum lead time, compared against server-side `new Date()`. It
  isn't currently wired into the Citas queue at all.
- The "Siguiente" tag (`AppointmentList.tsx:45,57-62`) is **not** a real future/past check — it's
  just "the earliest-in-time `SCHEDULED` row," confirmed in `docs/user-guide.md:177-178`. It offers no
  reusable "is this appointment still upcoming" logic; a 9am appointment forgotten until 4pm would
  still show "Siguiente" with no overdue indicator, a separate pre-existing gap not scoped to this
  finding.
- Cancelar is unaffected by this finding — cancelling a future appointment is normal, expected
  behavior (a patient calling ahead to cancel), so no time guard applies there.

**Decided:**

- Rename the button from **"Atendió" to "Asistió"** to match "No asistió"'s verb family. The
  resulting status pill also changes from **"Atendido" to "Asistió"**, so the button and the status
  it produces stay consistent with each other.
- Add a **future-time guard**: the "Asistió"/"No asistió" buttons are **hidden entirely** (not just
  disabled) for any appointment whose scheduled date+time hasn't passed yet, reusing the existing
  `laPazDateTimeToUtc` + server-time comparison pattern already used for the booking lead-time check.
  Only "Cancelar" remains visible/available for a future appointment; the attended/no-show buttons
  appear once the scheduled time has actually passed.

**For the eventual design-AI prompt:**

- [ ] Update every occurrence of "Atendió"/"Atendido" across `design/Alivia Panel Prototype.dc.html`,
      `design/Alivia.dc.html`, and `design/Alivia Prototype.dc.html` to "Asistió", and add the
      future-time guard to the prototype's `setStatus`/button-rendering logic (buttons hidden until
      the row's time has passed).
- [ ] Add a backlog item in `docs/backlog.md` for this change (likely two sub-items: the copy rename,
      and the time-guard enforcement, since one is cosmetic and the other is a real validation rule).
- [ ] Implement: rename the button text and status-pill label in `AppointmentList.tsx:24,98`; update
      `AppointmentList.test.tsx`/`AppointmentsEditor.test.tsx` assertions accordingly. Add a
      time-passed check — reusing `laPazDateTimeToUtc(appointment.date, appointment.startMinutes) <
    now` — both in `AppointmentList.tsx`'s button-rendering condition (hide when still in the
      future) **and** as a server-side guard in `updateAppointmentStatus.ts` (reject the transition if
      the appointment's time hasn't passed, mirroring the existing ownership/status checks) so the
      rule holds even if a stale client tries to call it directly. Add tests covering: a future
      appointment shows no Asistió/No asistió buttons, and the server action rejects the transition
      if attempted anyway.

---

## 7. Most destructive actions fire immediately, no confirmation step — caused a real accidental cancellation

**Where:** app-wide, across the panel and admin. Triggered by actually clicking "Cancelar" on
Ruben Daleney's 11:40 appointment by accident, with no "are you sure?" step in between.

**Investigated:** full inventory of every destructive/hard-to-reverse action in the app:

| Action                                          | File:line                                                                                                  | Fires immediately?          | Existing confirm step?                                                                                          |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Cancelar** (Citas/Agenda queue)               | `AppointmentList.tsx:107-113` → `AppointmentsEditor.tsx:85-90` → `updateAppointmentStatus(id,"CANCELLED")` | Yes, one click              | None                                                                                                            |
| **Canceló** (Confirmaciones queue)              | `ConfirmationList.tsx:83-89` → `ConfirmationsEditor.tsx:29-34` → `updateAppointmentStatus(id,"CANCELLED")` | Yes, one click              | None                                                                                                            |
| **Desactivar/Reactivar** account (Admin)        | `PracticeDetail.tsx:114-125,29-33` → `toggleAccountActive`                                                 | Yes, one click              | None                                                                                                            |
| **Restablecer contraseña** (Admin)              | `PracticeDetail.tsx:126-133,35-40` → `resetAccountPassword`                                                | Yes, one click              | None                                                                                                            |
| **Quitar** (Vacation)                           | `VacationList.tsx:48-56` → `VacationEditor.tsx:32-37` → `deleteVacation`                                   | Yes, one click              | None                                                                                                            |
| **Quitar** (Location, 0 schedule blocks)        | `LocationList.tsx:64-70` → `LocationEditor.tsx:36-40` → `deleteLocation`                                   | Yes, one click              | None                                                                                                            |
| **Quitar** (Schedule block)                     | `ScheduleBlockList.tsx:61-67` → `ScheduleEditor.tsx:58-63` → `deleteScheduleBlock`                         | Yes, one click              | None                                                                                                            |
| **Iniciar sesión como…** (impersonation, Admin) | `PracticeDetail.tsx:134-146` stages state only; real confirm modal at `:163-197`                           | No                          | **Yes** — a real `fixed inset-0` overlay modal, hand-rolled, not a shared component                             |
| **Quitar** (Location, has schedule blocks)      | `LocationList.tsx:64-70,77-103`                                                                            | No                          | **Yes** — an inline `confirmingId`-gated warning banner with Confirmar/Cancelar, hand-rolled                    |
| Patient-facing cancel (`/cancel/[token]`)       | `CancelCard.tsx:81-94`                                                                                     | No — dedicated confirm page | **Yes** — the page itself is the confirm step ("¿Cancelar tu cita?" / "Sí, cancelar cita" / "Mantener mi cita") |

No `Modal`/`Dialog` component and no `window.confirm()` usage exists anywhere in `src/` — the two
"yes" rows above are each hand-rolled local state (`impersonateTarget`, `confirmingId`), not a shared
component.

Design source-of-truth check, action by action: the 7 zero-confirm actions in the table above all
match the design exactly — `design/Alivia Panel Prototype.dc.html`'s `setStatus`/`cancel`/
`toggleActive`/vacation/schedule-block handlers all fire directly too, **so this isn't a build
deviation for those seven** — the gap is baked into the design source itself. The impersonation modal
and the patient-facing cancel page also match the design precisely (both are explicitly documented
as deliberate two-step flows: `design/README.md:176` for impersonation, and the identical
`isCancel`/`doCancel`/`keepAppt` pattern in `design/Alivia Prototype.dc.html:200-216` for patient
cancel). The Location-with-blocks inline banner is the one interesting case: the design's own demo
only shows a dead-end `alert('...(demo)')` for this, but `design/README.md:162` explicitly instructs
_"implement as a confirmation modal"_ — so the build's inline banner already goes beyond the demo
markup to satisfy that written instruction, just as an inline banner rather than a true modal overlay.

**Decided:**

- Add a confirmation step to **all 7** currently-unguarded destructive actions — not just the two
  Cancelar/Canceló actions that caused this specific accident.
- Build one **shared, reusable `ConfirmDialog` component** and use it for all 9 destructive actions
  total: the 7 newly-guarded ones, plus migrating both existing hand-rolled patterns (the impersonation
  modal and the Location-with-blocks inline banner) onto it — so there's one consistent
  confirm/cancel look and behavior app-wide, not two different ad-hoc implementations plus 7 new ones.
- Patient-facing cancel (`CancelCard.tsx`) is unaffected — it's already a dedicated confirm page by
  construction (open the link, then click "Sí, cancelar cita"), not a single button in a list, so
  there's no single click-to-fire action there to wrap.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Panel Prototype.dc.html` to add the confirmation-modal pattern to all
      currently-immediate destructive actions (Cancelar, Canceló, Desactivar/Reactivar, Restablecer
      contraseña, Vacation Quitar, Location Quitar, Schedule block Quitar), and reconcile the
      Location-with-blocks demo (`alert('...(demo)')`) to actually match `design/README.md:162`'s own
      instruction to use a real confirmation modal, matching the shared pattern now used everywhere
      else.
- [ ] Add a backlog item in `docs/backlog.md` for this change.
- [ ] Implement: a shared `src/components/ui/ConfirmDialog.tsx` (title, body copy, confirm/cancel
      buttons, `fixed inset-0` overlay styling reused from the existing impersonation modal in
      `PracticeDetail.tsx:163-197`). Wire it into: `AppointmentList.tsx`/`AppointmentsEditor.tsx`
      (Cancelar), `ConfirmationList.tsx`/`ConfirmationsEditor.tsx` (Canceló), `PracticeDetail.tsx`
      (Desactivar/Reactivar, Restablecer contraseña — replacing the existing hand-rolled impersonation
      modal with the shared component too), `VacationList.tsx`/`VacationEditor.tsx` (Quitar),
      `LocationList.tsx`/`LocationEditor.tsx` (Quitar, both the 0-blocks and has-blocks cases —
      replacing the existing inline banner), and `ScheduleBlockList.tsx`/`ScheduleEditor.tsx` (Quitar).
      Update every affected component's tests to click through the new confirm step instead of
      asserting the action fires directly on the first click.

---

## 8. Confirmaciones queue — cancelled appointments should drop off the list, not stay visible

**Where:** the panel's Confirmaciones screen. Surfaced from the same appointment cancelled by
accident in Finding #7 (Ruben Daleney, 11:40, Viernes 24 de julio) — it kept showing on
Confirmaciones with a red "Canceló" pill even though "0 pendientes" was shown at the top.

**Investigated:**

- `src/lib/confirmations/getConfirmationsQueue.ts:34-38` — the Prisma query fetches **every**
  appointment for tomorrow with no status filter at all (no `status: "SCHEDULED"` or
  `status: { not: "CANCELLED" }` clause). The sibling function
  `getPendingConfirmationsCount.ts:14-17` _does_ filter to `status: "SCHEDULED", confirmation:
"PENDING"` — so the codebase clearly knows how to exclude cancelled rows, it just wasn't applied to
  the list query itself.
- `ConfirmationList.tsx:25-27` computes the "N pendientes" count as a filtered subset
  (`status === "SCHEDULED" && confirmationStatus === "PENDING"`), separate from what actually renders
  in the list below (`:91-100`, showing `"Canceló"` for any `status === "CANCELLED"` row). So the
  count and the list membership are independently computed — this is why "0 pendientes" and a visible
  "Canceló" row can coexist.
- Confirmed **intentional, not a bug**: `docs/user-guide.md:187-199` documents this exact behavior in
  writing ("every appointment scheduled for tomorrow... already-resolved rows show a pill instead of
  buttons"), the schema comment on `Appointment.confirmation`
  (`prisma/schema.prisma:171-173`, "never a terminal state") and `docs/flows/domain-lifecycles.md:43-46`
  explain why a cancelled row can carry a stale `confirmation: PENDING` value forever, and the design
  source (`design/Alivia Panel Prototype.dc.html:703-715`) has the identical `patientCancel` logic —
  flips `status` in place, never removes the row from the array. This matches the design/docs exactly;
  it isn't a build deviation.

**Decided:**

- Change the behavior anyway: a **cancelled** appointment should be **removed from the Confirmaciones
  list entirely**, rather than staying visible with a "Canceló" pill — once cancelled, there's nothing
  left to check in on for tomorrow, so it shouldn't occupy space on this screen.
- **Confirmed** appointments are unaffected by this decision — a "✓ Confirmó" row still stays visible
  as-is; only the cancelled case changes.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Panel Prototype.dc.html`'s Confirmaciones demo logic (`patientCancel` at
      `:713` and the render map at `:703-715`) so a cancelled row is filtered out of the rendered list
      instead of staying and flipping to a "Canceló" pill.
- [ ] Add a backlog item in `docs/backlog.md` for this change.
- [ ] Implement: add `status: { not: "CANCELLED" }` (or equivalent) to the `where` clause in
      `getConfirmationsQueue.ts:34-38`, so cancelled appointments never come back from the query at
      all. Remove the now-unreachable `cancelled`/`"Canceló"` branch from
      `ConfirmationList.tsx:44-46,91-100` (the `confirmed`/`"✓ Confirmó"` branch stays). Update
      `getConfirmationsQueue.test.ts` and `ConfirmationList.test.tsx`/`ConfirmationsEditor.test.tsx`
      to reflect that cancelling a row makes it disappear from the list rather than asserting a
      "Canceló" pill appears.

---

## 9. Horarios — native `type="time"` inputs look bad and deviate from the design

**Where:** the panel's Horarios (schedule editor) screen — the "+ Agregar bloque" form's "Hora de
inicio"/"Hora de fin" fields. Screenshotted mid-exploration: clicking the field pops open the
browser/OS's own native time-picker widget (white box, hour/minute/AM-PM columns, blue highlight).

**Investigated:**

- `src/components/panel/schedule/ScheduleBlockForm.tsx:121-127,136-142` — both fields are plain
  `<input type="time">`, no wrapping popover, no `appearance-none`, nothing intercepting the picker —
  the class string is box styling only (border/radius/padding/focus color). The native picker chrome
  screenshotted is entirely browser/OS-drawn and unreachable by CSS.
- This is genuinely **browser/OS-dependent**, not just a Safari quirk: Chrome/Edge draw small inline
  spinner segments instead of a dropdown, Firefox similarly inline, iOS Safari uses a bottom-sheet
  wheel picker, Android Chrome a modal clock dial — none of them match the app's design system, and
  none of them look like each other either.
- Grepped the whole codebase — these are the **only two** `type="time"` inputs anywhere in `src/`.
- **Real deviation from the design**, not just a native-styling gap: `design/Alivia Panel Prototype.dc.html:262`
  uses a **single free-text field** (e.g. `placeholder="Horario (8:00–12:00)"`, demo value
  `schedTime:'9:00–13:00'`, line 871), parsed by splitting the typed string on the dash and then on
  the colon (`timeMins()`, line 611) — not two separate structured start/end fields, and no
  `type="time"` anywhere in the design file at all (zero matches). So the build's two-field,
  native-time-input structure is a genuine departure from what the design specifies, not merely an
  unstyled implementation of an already-specified control.
- Existing precedent in the app for exactly this situation: `DoctorProfileCalendar.tsx` (round 1
  Finding #4) was hand-built from scratch — real `<div>`/`<Link>` grid, custom prev/next glyphs,
  custom day-cell states — specifically because a native date control would've looked wrong against
  Alivia's design system (its own code comment, line 34, calls this out as "a deliberate departure
  from Alivia's usual pill-based style"). The same form's own "Días" field
  (`ScheduleBlockForm.tsx:90-112`) is already a custom pill-button row rather than a native
  multi-select — so this form has already made that call for one field, just not for time.

**Decided:**

- Keep **separate, structured** "Hora de inicio"/"Hora de fin" fields (better validation than one
  free-text string a staff member has to type in an exact `8:00–12:00` format) — don't revert to the
  design's single-text-field approach.
- Replace the native `type="time"` input with a **custom-styled hour/minute dropdown control**,
  matching the app's design system — same rationale as the custom calendar built for round 1
  Finding #4.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Panel Prototype.dc.html`'s schedule-block form (currently the single
      `schedTime` free-text field, line 262) to spec two custom hour/minute dropdown controls for
      Hora de inicio / Hora de fin, replacing both the free-text field and any implied native
      `type="time"` behavior — this needs its own visual design pass since neither existing artifact
      (design's text field, build's native input) is what's being kept.
- [ ] Add a backlog item in `docs/backlog.md` for this change.
- [ ] Implement: a custom `src/components/ui/TimeInput.tsx` (or similar) — hour + minute (+ AM/PM if
      the app uses 12-hour format elsewhere, otherwise 24-hour to match `minutesOfDay`-style storage
      used in `laPazDateTimeToUtc`) rendered as styled dropdowns/selects consistent with the design
      system, replacing the `type="time"` inputs in `ScheduleBlockForm.tsx:121-127,136-142`. Update
      `ScheduleBlockForm.test.tsx` accordingly.

---

## 10. Vacaciones — no edit affordance, and no overlap validation between periods

**Where:** the panel's Vacaciones screen. Screenshotted mid-exploration: "1–8 ago 2026" (Todas las
ubicaciones) and "4–15 ago 2026" (Consultorio Dental Guzmán - Sopocachi) already coexist despite
overlapping Aug 4–8 for that location.

**Investigated — two separate issues:**

**(a) No edit affordance.** `src/components/panel/vacation/VacationList.tsx:48-56` renders only a
`Quitar` button per row — no `onEdit` prop, no edit button, no inline-edit state anywhere in
`VacationEditor.tsx`, and no `updateVacation.ts` exists in `src/lib/vacation/` at all (compare
`src/lib/schedule/updateScheduleBlock.ts`, which does exist for the analogous Schedule screen).
Confirmed this matches the design exactly, not a build gap: `design/Alivia Panel Prototype.dc.html:274-294`
also renders only a `Quitar` button (`v.remove`), and `docs/flows/doctor-assistant-panel.md:140-151`'s
Vacation flowchart has only a `Quitar` terminal edge — a deliberate contrast with the same document's
Schedule-editor flowchart three lines above it, which explicitly has both `Editar` and `Quitar`
branches. So Vacation editing was never specified anywhere; Schedule got it, Vacation didn't.

**(b) No overlap validation.** `src/lib/vacation/createVacation.ts` (37 lines, full file) only
validates the input's own shape (`isValidVacationInput`: non-empty dates, `startDate <= endDate`) and
that a given `locationId` belongs to the doctor — it never queries the doctor's existing `Vacation`
rows at all, so no date-range/location intersection check exists anywhere. `Vacation.locationId` is
nullable (`prisma/schema.prisma:130-140`, comment: "null = the whole practice is away, not just one
Location") — an overlap check needs to treat null as a wildcard on **both** sides of the comparison,
exactly the reasoning already implemented (for a different purpose — hiding slots from patients, not
create-time validation) in `src/lib/slots/isDateOnVacation.ts:14-19`. Confirmed matching the design:
the design's `addVacation()` (`Alivia Panel Prototype.dc.html:893`) only guards on non-empty start
date, no comparison against other vacations at all.

This is the **same class of bug** already found and fully fixed for Horarios in round 1's Finding #5
(schedule blocks could double-book two locations at the same day/time) — that fix produced a reusable
pattern: a pure predicate (`src/lib/schedule/scheduleBlocksOverlap.ts`) wired into both
`createScheduleBlock.ts`/`updateScheduleBlock.ts`, throwing a named-location Spanish error on
conflict, with the design source updated to match (`design/Alivia Panel Prototype.dc.html:873-887`).
That fix was never extended to Vacation, so the identical class of gap persists here, undocumented
anywhere as an intentional exception — `design/README.md:188`'s overlap-validation sentence is
explicitly scoped to "a schedule block" only, silent on Vacation.

**Decided:**

- Add an **"Editar"** action alongside "Quitar" on each vacation entry, matching the pattern already
  used on the Schedule screen (`ScheduleBlockList.tsx`'s `Editar`/`Quitar` pair) — editing reopens the
  Ubicación/Desde/Hasta form pre-filled with that entry's values. Same gating as removal
  (`isVacationRemovable`: only editable **before** the period starts) — it wouldn't make sense to
  allow editing a vacation already in effect if it can't even be removed at that point.
- Add **overlap validation** on create (and on the new edit path): reject a new/edited vacation period
  if its date range intersects an existing one **for the same location or against an "all locations"
  (null) entry on either side** — following the same shape as round 1's schedule-block fix (a pure
  predicate function + a named-location error message), extended to cover this gap that fix didn't
  reach.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Panel Prototype.dc.html`'s Vacaciones screen to add an `Editar` button per
      entry (matching the Schedule editor's existing pair) and add the cross-vacation overlap check to
      `addVacation()` (and its new edit equivalent), mirroring `saveSchedBlock`'s existing inline-error
      pattern (`:873-887`). Update `design/README.md:161,188` and
      `docs/flows/doctor-assistant-panel.md:140-151`'s Vacation flowchart to add the `Editar` branch and
      note the overlap rule, matching how Schedule is already documented.
- [ ] Add a backlog item in `docs/backlog.md` for this change (likely two sub-items: edit affordance;
      overlap validation — since they're independent pieces of work).
- [ ] Implement: `src/lib/vacation/updateVacation.ts` (new, mirroring `updateScheduleBlock.ts`'s
      shape — ownership check, re-run the same overlap validation excluding the vacation's own id). A
      new `src/lib/vacation/vacationsOverlap.ts` pure predicate (date-range intersection +
      null-locationId-as-wildcard on both sides, modeled on `isDateOnVacation.ts`'s existing
      null-handling), wired into both `createVacation.ts` and the new `updateVacation.ts`, throwing a
      named-location Spanish error on conflict. `VacationList.tsx` gets an `Editar` button (gated by
      the same `isVacationRemovable` check) alongside `Quitar`; `VacationEditor.tsx` gets edit-mode
      state (pre-filling `VacationForm`) mirroring `ScheduleEditor.tsx`'s existing edit-mode handling.
      Add tests for: overlapping same-location periods rejected, an "all locations" period conflicting
      with any specific-location period rejected, editing excludes the row's own id from the check.

---

## Notes

- Test accounts and routes for exploring are listed in `docs/user-guide.md`.
- If a finding turns out to be intentional/expected, it's worth a one-line mention here anyway so the
  next person doesn't re-report it — mark it **Not an issue** instead of Open/Planned/Decided.
