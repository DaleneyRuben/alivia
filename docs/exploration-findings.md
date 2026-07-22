# Exploration Findings & Action Items

A running log from manually exploring the live app (see `docs/user-guide.md` for the screen-by-screen
reference). Add an entry here anytime something looks surprising, broken, or missing while clicking
through — I'll investigate each one against the actual code, the `./design` source-of-truth, and
existing docs/ADRs before we agree on an action item, so nothing gets "fixed" based on a guess.

**This is a documentation-only session.** Nothing here gets implemented, and `./design` doesn't get
touched, while exploration is still in progress. Once everything's been walked through, these
findings get consolidated into a single prompt for the design AI, which is what actually updates
`./design`, adds backlog items, etc. This doc's job until then is only to capture findings and the
decisions/open questions attached to each one.

## How an entry gets resolved

1. You report what you saw and where.
2. I check whether it's a real gap (in code, in `./design`, or both) or expected behavior, and say which.
3. Any open design/product questions get resolved here, in writing — as a decision, not a change.
4. Once exploration wraps, all entries get bundled into a design-AI prompt to actually execute
   (design updates, backlog items, then implementation) — nothing before that.

## Findings log (summary)

| #   | Area                                | Finding                                                                                                                                      | Status            |
| --- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1   | Panel & Admin nav (all roles)       | No logout control anywhere in the panel or admin nav.                                                                                        | Design updated ✅ |
| 2   | Patient site home header            | "Ingresar" button should be removed — staff will log in via a separately shared direct link instead.                                         | Design updated ✅ |
| 3   | Booking form + 3 other phone inputs | Drop the reassurance line + placeholders; add a country-flag dropdown everywhere a phone number is typed.                                    | Design updated ✅ |
| 4   | Doctor profile page (patient site)  | Remove upfront Ubicaciones list, add a date picker (only today's slots shown today), enforce a 2-hour minimum lead time on bookable slots.   | Design updated ✅ |
| 5   | Horarios (schedule editor)          | A doctor can create schedule blocks at two different locations that overlap in day/time — physically impossible, and not validated anywhere. | Design updated ✅ |
| 6   | Result card (Home + Results)        | Whole card is clickable today — only the "Reservar" button should be.                                                                        | Design updated ✅ |

**Design-AI round 1 audit (2026-07-22):** ran `docs/design-brief-updates.md` through the design AI,
then double-checked every change against source (`.dc.html` markup + JS state) and a live headed
run of both prototypes. 5 of 6 items came back matching the decisions exactly. Item #3 has one real
gap — see its section below — sent back for a follow-up pass
(`docs/design-brief-updates-followup.md`).

---

## 1. No logout control in the panel/admin nav

**Where:** every screen inside `/panel/*` and `/admin/*` — the nav bar shows the signed-in
avatar/name/role but nothing to sign out.

**Investigated:** Confirmed missing in **both** places, not just one:

- Code: `signOut` is exported from `src/lib/auth/index.ts` (NextAuth) but never called from any
  component — grepped the whole `src/` tree, it appears in exactly one place, its own export line.
- Design source-of-truth: `design/Alivia Panel Prototype.dc.html`'s nav avatar/role block
  (`{{ meAvatarStyle }}` / `{{ meName }}` / `{{ meRole }}`) has no click handler or dropdown either.

So this isn't an implementation slip — the design itself never specified logout. It's a genuine gap
in the spec, not a bug in the build.

**Decided:** clicking the signed-in avatar/name block (in both the panel nav and the admin nav)
opens a small dropdown with a "Salir" item — not an always-visible button next to it. This is a new
interaction pattern for Alivia (nothing else in the app currently uses a click-to-reveal menu), so
the design-AI prompt should call that out explicitly rather than assume it matches existing
conventions.

**For the eventual design-AI prompt:**

- [ ] Add the avatar-click → dropdown → "Salir" interaction to
      `design/Alivia Panel Prototype.dc.html` (both the panel shell and the admin shell), and to
      `Alivia.dc.html`'s embedded panel frames since they stay in sync per the design README.
- [ ] Add a backlog item in `docs/backlog.md` to track the implementation.
- [ ] Implement: wire `signOut()` into `PanelNav` and `AdminNav`, redirecting to `/login`.

---

## 2. Remove "Ingresar" from the patient site — staff will get a separate direct link

**Where:** the home page header only (`PatientHeader.tsx`). Confirmed via grep this is the _only_
place anywhere in the patient-facing site that links to `/login` — results, doctor profile,
booking, confirmation, and cancel pages don't have it.

**Investigated:** Also present in the design source-of-truth — `design/Alivia Prototype.dc.html`
(the file the design README calls out as "source of truth for **patient-site** behavior") shows the
same "Ingresar" pill in the home top bar. The older static canvas, `Alivia.dc.html`, shows a fuller
marketing nav ("Especialidades", "¿Eres doctor?", "Ingresar") that was never actually built — worth
noting that file is a broader/earlier reference, not a 1:1 spec for what exists today.

**Decided:**

- `/login` itself stays live and fully functional — it's just no longer linked from the patient
  site. Doctors/Assistants/Admin will reach it via a separate link you share directly.
- Scope is exactly this one button, nowhere else.
- The "separate direct link" is just the existing `/login` URL, unchanged, shared manually
  (e.g. WhatsApp) whenever someone needs it — not a new path, and not a personalized/token-based
  link like the setup and password-reset links already used in `CreatePracticeForm`/
  `PracticeDetail`. No new engineering beyond removing the button. Anyone who guesses the URL still
  hits the same login form, but they'd still need real credentials to get in.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Prototype.dc.html` to drop the "Ingresar" pill from the home top bar
      (and decide whether `Alivia.dc.html`'s older canvas variant is worth touching too, given it's
      already out of sync with the built app).
- [ ] Add a backlog item in `docs/backlog.md` for this change.
- [ ] Implement: remove the `Link` to `/login` from `PatientHeader.tsx`, update
      `PatientHeader.test.tsx` accordingly.

---

## 3. Booking form copy/placeholders, plus a country-code dropdown for phone numbers

**Where:** the patient-facing Booking screen (`BookingForm.tsx`) — screenshotted mid-exploration.
Requested: remove the "Sin cuenta ni contraseña. Podrás cancelar cuando quieras." line under the
submit button, remove the placeholder text in both fields ("Ej. María Quispe" / "+591 7XX XXX XX"),
and add a country-flag dropdown next to the phone input since patients aren't necessarily calling
from a Bolivian number.

**Investigated:** grepped every phone-number input in the app. The exact same Bolivia-only
assumption — placeholder `+591 7XX XXX XX` / `+591 71234567`, no country selector — appears in
**four places total**, not just this screen:

- `src/components/patient/BookingForm.tsx` (this one)
- `src/components/panel/appointments/ManualAppointmentForm.tsx` (staff "+ Agregar cita" walk-in entry)
- `src/components/admin/CreatePracticeForm.tsx` (doctor phone field _and_ assistant phone field)

The design source-of-truth has the identical gap — `design/Alivia Prototype.dc.html`'s booking
screen also hardcodes the `+591` placeholder and the same reassurance line, and never specifies a
country selector anywhere. Also checked how phone is stored today: it's saved as a single free-text
string with no parsing (`createGuestAppointment.ts` just trims and saves whatever was typed, keyed
by `doctorId_phone` for uniqueness) — so adding a country code changes what actually lands in that
field, which is why this needed deciding rather than assuming.

**Decided:**

- Remove the "Sin cuenta ni contraseña…" line from the Booking screen entirely.
- Remove placeholder text from both fields on the Booking screen (labels stay, inputs start empty).
- Add the country-flag dropdown to **all four** phone inputs (Booking, the staff walk-in form, and
  both doctor/assistant fields in Crear consulta) — not just Booking — for consistency.
- Country list is the **full global list** (flag + dial code per country), not a short curated one,
  with **Bolivia (+591) preselected** by default everywhere, since that's still the platform's home
  market.
- The saved phone value is **strict E.164** (e.g. `+15551234567`, no space) — chosen over a
  "+1 5551234567"-with-space format because it's what reliably builds correct `wa.me` WhatsApp
  links downstream, at the cost of being slightly less human-readable raw in the database (Citas/
  Confirmaciones lists will need their own display formatting if a friendlier on-screen format is
  wanted later — worth another look once this is built, not blocking the decision now).

**For the eventual design-AI prompt:**

- [x] Update `design/Alivia Prototype.dc.html`'s booking screen: drop the reassurance line and both
      placeholders, add the country-flag + dial-code dropdown ahead of the phone input.
- [x] Apply the same country-flag dropdown to the equivalent fields in
      `design/Alivia Panel Prototype.dc.html` (the "+ Agregar cita" walk-in form) and the admin
      create-practice screen (doctor + assistant phone fields).
- [x] Add a backlog item in `docs/backlog.md` covering all four inputs as one piece of work.
- [x] Implement: a shared phone-input component (country dropdown + number field, E.164 output) used
      by `BookingForm`, `ManualAppointmentForm`, and `CreatePracticeForm` — not four separate
      one-off implementations. Update `isValidGuestBookingInput`/equivalents and existing seed data
      /tests that assume bare `+591 …` strings.

**Implementation note (2026-07-22):** built as `src/components/ui/PhoneInput.tsx`, backed by
`src/lib/phone/countryDialCodes.ts` (the same 195-country, Bolivia-first list from the design source)
and `src/lib/phone/toE164.ts`. `isValidGuestBookingInput`/`isValidManualAppointmentInput`/
`isValidCreatePracticeInput` needed no changes — they only check string length, not format. No seed
data stores phone numbers, so nothing there needed updating either; only the three component tests
that typed a full `+591 …` string into a single field were updated to type just the national number
and expect E.164 output.

**Design-AI audit result (2026-07-22):** round 1 came back correct except the country list, which
only had ~27 countries instead of the decided full global list. Sent back a follow-up prompt
(`docs/design-brief-updates-followup.md`) scoped to just that gap.

**Follow-up audit (2026-07-22):** fixed. Both `design/Alivia Prototype.dc.html` and
`design/Alivia Panel Prototype.dc.html` now carry the identical **195-country** list (Bolivia listed
first), confirmed live in a headed run of the actual rendered `<select>` — 195 options, `+591`
selected by default. Re-checked the other five findings for regressions from this follow-up pass;
all five still intact. This finding is fully resolved.

---

## 4. Doctor profile page (patient site) — Ubicaciones, date range, and a lead-time rule

**Where:** the patient-facing doctor profile screen (`DoctorProfile.tsx` / `SlotPicker.tsx`) —
screenshotted mid-exploration (Dra. Carla Mendoza, a doctor with 2 locations).

**Three things raised:**

1. The standalone "Ubicaciones" list (all of the doctor's locations, shown upfront with no
   connection to any specific time slot) is confusing — unclear what it's for before picking a time.
2. Only one day's slots are ever shown (labeled "Hoy"/"Mañana"/a date) — there's no way to look
   further ahead.
3. Slots that start less than 2 hours from now are still shown as bookable — there's no lead-time
   validation at all.

**Investigated:**

- `getPublicDoctorProfile.ts` already computes availability across a **14-day window**
  (`SEARCH_WINDOW_DAYS = 14`) internally, but only ever returns **one single day's** slots
  (`slotsDate` — the earliest date with any generated slot) to the page. The 14-day computation
  already happening server-side is simply never surfaced to the patient.
- `getAvailableSlots.ts` has no time-of-day filtering whatsoever — it only excludes vacation days and
  applies capacity. A slot 10 minutes from now shows exactly the same as one next week. Grepped
  `CONTEXT.md`/ADRs/design docs for any existing "minimum lead time" rule — there is none. This is a
  brand new rule, not a previously-specified one that got missed.
- The design source-of-truth (`design/Alivia Prototype.dc.html`) has the identical shape: the same
  Ubicaciones list, the same single-day-only slot grid labeled "Hoy", and nothing about a date picker
  or a lead-time rule anywhere in its behavior notes. Not an implementation gap — matches the design.
- Per `CONTEXT.md`'s own definition of **Location** — "not used as a patient-facing search filter…
  surfaced at the moment a patient picks a time slot" — showing a location list upfront was never
  the documented intent to begin with. The Booking screen (`BookingForm.tsx`) already does show the
  specific location once a slot is picked, which is exactly the intended behavior — the profile page
  showing a _separate_, disconnected Ubicaciones list on top of that is the actual problem.

**Decided:**

- Remove the standalone Ubicaciones list from the doctor profile screen. Location stays revealed
  only at the booking-confirm step, as it already is today.
- Add a small **per-slot location label** on each time button in the grid, so a doctor with multiple
  locations is still clear at a glance which location a given time belongs to, without waiting for
  the confirm step.
- Add a **date picker** so patients can browse beyond the single day currently shown — implemented as
  a real calendar/date-picker widget (not an extension of the existing Hoy/Mañana pill pattern), a
  deliberate departure from Alivia's usual pill-based style for this specific control. Range should
  reuse the existing 14-day window already computed server-side, unless that turns out to feel too
  short once it's actually visible to patients.
- Add a **2-hour minimum lead time**: a slot starting less than 2 hours from now is no longer shown
  as bookable to patients. Scope is **patient self-booking only** — mirrors the existing
  capacity precedent in [ADR-0009](../adr/0009-slots-have-capacity.md), where staff can still add a
  walk-in appointment for a near-term slot via "+ Agregar cita" in Citas, since staff already know
  what the doctor can actually still fit in.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Prototype.dc.html`'s doctor-profile screen: drop the Ubicaciones section,
      add a per-slot location label to the slot grid, add a calendar date-picker control, and reflect
      that slots inside the next 2 hours no longer appear.
- [ ] Add a backlog item in `docs/backlog.md` for this (likely worth splitting into two: the
      profile-page UI changes, and the lead-time rule, since they touch different layers).
- [ ] Implement: `getPublicDoctorProfile.ts` needs to accept a selected date (defaulting to today)
      and return that date's slots instead of always the single earliest date; `getAvailableSlots.ts`
      needs a "now + 2 hours" filter applied only for the patient-facing path (staff's
      `ManualAppointmentForm` path must stay unaffected); `SlotPicker.tsx` needs the location label
      and the new date-picker control; `DoctorProfile.tsx` drops the Ubicaciones rendering.

---

## 5. Horarios (schedule editor) — a doctor can create impossible double-booked availability

**Where:** `createScheduleBlock.ts` / `updateScheduleBlock.ts`, used by the Horarios screen.
Surfaced while investigating Finding #4 above, not something directly screenshotted — but it's a
real, separately-trackable gap in its own right, not just supporting detail for the profile page.

**In plain terms:** if a doctor sets up "Mondays 8am–12pm at Clínica del Corazón," nothing stops
them from also saving "Mondays 8am–12pm at Consultorio San Miguel" — even though a doctor obviously
can't be in two places at the same time. The schedule-editing screen has no way of knowing this is
impossible and just saves it.

**Investigated:** confirmed by reading both server actions directly —

- `createScheduleBlock.ts` only checks that the new block's own shape is valid
  (`isValidScheduleBlockInput`: non-empty weekdays, end after start, capacity ≥ 1, etc.) and that the
  target location belongs to the doctor. Nothing compares it against the doctor's _other_ schedule
  blocks — same location or a different one.
- `updateScheduleBlock.ts` has exactly the same gap.
- This is what actually causes Finding #4's "two identical time buttons" symptom on the patient
  profile page — it's the root cause, not a display bug.

**Decided:** yes, track this as its own separate item, distinct from the profile-page display
question — it's really a bug in the Horarios (schedule-setup) screen, not the patient-facing
profile page. Once this is fixed, two different locations can no longer generate a same-day,
same-time slot for one doctor, so the per-slot location label added in Finding #4 becomes a
belt-and-suspenders clarity aid rather than something masking a real conflict.

**For the eventual design-AI prompt:**

- [ ] Decide the exact validation rule (e.g. reject a new/edited block if any of its weekdays overlap
      an existing block's weekdays _and_ its time range overlaps, across any of the doctor's other
      locations) and how the error surfaces in the Horarios UI — this needs its own design pass, not
      just a silent save-rejection.
- [ ] Add a backlog item in `docs/backlog.md`.
- [ ] Implement: add the overlap check to `createScheduleBlock.ts` and `updateScheduleBlock.ts`
      (and surface a clear error in `ScheduleBlockForm.tsx`/`ScheduleEditor.tsx`), plus a test
      covering the two-locations-same-time case.

---

## 6. Result card (Home + Results) — whole card is clickable, only "Reservar" should be

**Where:** `ResultCard.tsx` — the doctor row shown both on the Home page's "Disponibles ahora"
featured strip and the Results page's filtered list (same component, used in both places).
Screenshotted mid-exploration (Dra. Carla Mendoza card).

**Investigated:** confirmed the whole card is a single `<Link>` wrapping everything — avatar, name,
specialty, experience/verified chips, the next-available pill, _and_ the "Reservar" element, which
is actually just a `<span>` styled to look like a button, not its own separate link. Both the design
source-of-truth and the current build agree this is deliberate, not an accident: the design README
states plainly, for this exact card pattern, **"Whole card is clickable → profile."** So this is a
real requested change to existing, intentional behavior, not a bug fix.

**Decided:**

- Only the "Reservar" element becomes clickable; the rest of the card (avatar, name, specialty,
  chips, next-available pill) becomes plain, non-interactive content.
- "Reservar" still goes to the doctor profile page — same destination as today
  (`/doctors/${doctor.id}`), just a smaller click target than the whole card.
- The rest of the card intentionally has **no** click target of its own once this ships — this list
  (Home's featured strip and the Results list) only offers one action, "Reservar," not a separate
  way to browse into the profile from here.

**For the eventual design-AI prompt:**

- [ ] Update `design/Alivia Prototype.dc.html`'s result-card spec (used by both the round-1 patient
      prototype's Home and Results screens) to mark the card as non-clickable and "Reservar" as the
      sole interactive element, replacing the current "whole card is clickable" note.
- [ ] Add a backlog item in `docs/backlog.md`.
- [ ] Implement: in `ResultCard.tsx`, remove the outer `<Link>` wrapping the whole card; wrap only
      the "Reservar" `<span>` in a `<Link href={`/doctors/${doctor.id}`}>` instead. Affects both
      `ResultsList.tsx` and `FeaturedDoctorsSection.tsx` since they share this component — no separate
      change needed for each.

---

## Notes

- Test accounts and routes for exploring are listed in `docs/user-guide.md`.
- If a finding turns out to be intentional/expected (like the ADR-0008 availability-ranking
  behavior noted during earlier testing), it's worth a one-line mention here anyway so the next
  person doesn't re-report it — mark it **Not an issue** instead of Open/Planned/Done.
