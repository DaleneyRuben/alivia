# Alivia — design prompt, round 3 (updates from live testing)

Paste everything below into the same Claude.ai conversation used for rounds 1 and 2 (or a new one,
pasting the design tokens below for context). **Also attach/paste the three current design files**
— `Alivia Prototype.dc.html`, `Alivia Panel Prototype.dc.html`, and `Alivia.dc.html` — since this
round edits existing screens rather than adding new ones, and the conversation needs their actual
current markup to work from.

---

## Continuing an existing design — this round is fixes, not new screens

**Alivia**'s public patient site, the Doctor/Assistant panel, and Admin were all already designed in
two previous rounds. This round doesn't add any new screens — it's six specific fixes and changes
found by actually clicking through the built product. Match the established visual language exactly
— same colors, type, shape language, spacing, and icon treatment as everywhere else. Do not
introduce new tokens, fonts, or a different shape language except where a change explicitly calls
for a deliberate one-off (called out individually below). Only touch what's listed in the six items
below — leave every other screen exactly as currently specified.

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
`↓` sort, `←` back). No new icon set is being introduced in this round either — use the same
placeholder-glyph approach for anything new below (e.g. a dropdown chevron, a calendar icon).

---

## 1. Panel + Admin — add a logout control (new interaction pattern)

**File(s):** `Alivia Panel Prototype.dc.html` (both the panel nav shell and the admin nav shell),
and `Alivia.dc.html`'s embedded panel frames (they stay in sync with the panel prototype).

**Current state:** the signed-in avatar + name/role block (panel nav) and the "FN / Fundador" avatar
block (admin nav) are static — no click behavior, no way to sign out anywhere in the product.

**Change:** make that avatar/name block clickable. Clicking it opens a small dropdown menu
positioned just below it, containing one item: **"Salir"**. This is a genuinely new interaction
pattern for Alivia — nothing else in the product currently uses a click-to-reveal menu — so give it
a clear affordance (e.g. a small chevron `▾` next to the name/role text) so it doesn't look like the
same static info it's replacing. Style the dropdown itself like the app's existing small cards:
white background, existing border/radius tokens, the "framed" card shadow — don't invent a new
container style for it. Apply the identical treatment to both the panel nav and the admin nav.

---

## 2. Patient site — remove the "Ingresar" login button from the home page

**File:** `Alivia Prototype.dc.html` (home screen top bar only).

**Current state:** the home page's top bar has the Alivia logo on the left and an "Ingresar" pill on
the right, linking to the panel login.

**Change:** remove the "Ingresar" pill entirely. Nothing replaces it — the top bar becomes just the
logo, with empty space (or the logo alone, left-aligned) where the pill used to be. Doctors,
Assistants, and Admin will no longer log in by clicking through the patient site at all; they'll be
given the login link directly through another channel instead. This doesn't affect any other patient
screen (results, doctor profile, booking, confirmation, cancel don't show this button today either).
If `Alivia.dc.html`'s older static-canvas variation shows a fuller marketing nav ("Especialidades",
"¿Eres doctor?", "Ingresar"), drop "Ingresar" from there too for consistency — the other two items in
that older nav are out of scope for this change.

---

## 3. Country-code dropdown on every phone input, plus a Booking-screen cleanup

**File(s):** `Alivia Prototype.dc.html` (Booking screen), `Alivia Panel Prototype.dc.html` (the
"+ Agregar cita" walk-in form in Appointments, and both the doctor and assistant phone fields on the
Crear consulta / create-practice screen).

**Current state:** the Booking screen has a "Confirma tu cita" form with a name field and a phone
field (placeholder `+591 7XX XXX XX`), a reassurance line below the submit button reading "Sin
cuenta ni contraseña. Podrás cancelar cuando quieras.", and no country selector — same Bolivia-only
assumption is repeated in the three other phone fields listed above.

**Changes:**

- On the Booking screen only: remove the "Sin cuenta ni contraseña…" reassurance line entirely.
  Remove the placeholder text from both the name field ("Ej. María Quispe") and the phone field
  ("+591 7XX XXX XX") — fields start empty, labels stay as they are.
- Everywhere a phone number is entered (all four places listed above): add a country-code selector
  immediately to the left of the phone number input, same row — a compact dropdown showing a flag +
  dial code (e.g. 🇧🇴 +591), opening the full global list of countries by flag/dial code, with
  Bolivia (+591) preselected by default in every instance. This should read as one single, consistent
  component reused in all four places, not four different one-off treatments.

---

## 4. Doctor profile page — drop Ubicaciones, label slots by location, add a date picker, hide near-term slots

**File:** `Alivia Prototype.dc.html` (Doctor profile screen).

**Current state:** the profile screen shows, side by side: a left column with the doctor's bio and a
full "Ubicaciones" list (every location, shown upfront, unconnected to any specific time), and a
right column with a single day's slot grid labeled "Elige un horario · Hoy" — no date picker, no
per-slot location indicator, and slots show as available regardless of how soon they start.

**Changes:**

- Remove the "Ubicaciones" section entirely from this screen. The doctor's specific location for a
  chosen time is still revealed at the booking-confirmation step, exactly as it already works today
  — this screen just stops showing a separate, disconnected list of every location upfront.
- Add a small label to each time-slot button identifying which location that slot belongs to
  (relevant once a doctor has more than one location) — subtle, not a headline element, just enough
  that two different slots are never ambiguous.
- Add a real calendar/date-picker control near the slot grid, replacing the fixed "Hoy" label, so a
  patient can browse forward in time. This is a deliberate one-off: a real calendar control, **not**
  an extension of the pill-based Hoy/Mañana toggle used elsewhere in the product (e.g. in the panel's
  Appointments screen) — a genuinely different control for a genuinely different job (picking any of
  many days, not just "today vs. tomorrow"). Default browsable range: 14 days forward from today.
- Slots starting less than 2 hours from the current time no longer render as selectable/available in
  the grid (only relevant when the selected date is today).

---

## 5. Horarios (schedule editor) — an error state for double-booked locations

**File:** `Alivia Panel Prototype.dc.html` (the Horarios / schedule-editor screen).

**Current state:** a doctor can add a schedule block for any location with no check against their
other locations — nothing stops them from setting up, say, "Mondays 8–12" at two different locations
at once, which isn't physically possible for a solo doctor.

**Change:** design an error state that appears when a doctor tries to save a new or edited schedule
block whose days and times overlap with an existing block at a _different_ one of their locations.
There's no existing pattern in Alivia for this kind of cross-field conflict error, so it needs its
own treatment — e.g. an inline validation message near the day/time fields, styled with the same
error tokens already used elsewhere (the red-tinted `#F9E4DC` bg / `#B04A30` text banner used for the
login error is the closest existing precedent — reuse those colors rather than introducing new ones).
The message should make clear _why_ the save was rejected (the doctor already has hours at another
location during that time), not just that it failed.

---

## 6. Result cards (Home + Results) — only "Reservar" should be clickable

**File:** `Alivia Prototype.dc.html` (the result-card pattern shared by the Home screen's featured
doctors and the Results screen's list).

**Current state:** the entire result card — avatar, name, specialty, experience/verified chips, the
next-available pill, and the "Reservar" button — is one single click target leading to the doctor's
profile.

**Change:** the card itself (avatar, name, specialty, chips, next-available pill) is no longer
clickable at all — it's static content. Only the "Reservar" button is a click target, and it leads
to the same destination as before (the doctor's profile page) — just a narrower target than the
whole card. Since "Reservar" is now the only actionable element on an otherwise static card, give it
a slightly more obvious interactive treatment (e.g. a hover/pressed state) than it needed before.

---

## When you're done

Please also update the relevant entries in the existing design README's "Screens / Views" section
(the write-up engineers reference when translating these files into the actual app) so the written
spec matches the six changes above — not just the `.dc.html` files themselves.
