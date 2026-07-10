# Alivia — design prompt, round 2 (Doctor/Secretary panel + Admin)

Paste everything below into the same Claude.ai conversation (or a new one, pasting the design tokens below for context) to generate the remaining screens.

---

## Continuing an existing design

You already designed **Alivia**'s public patient site and a first-pass doctor dashboard in a previous round. This prompt is for the screens that round didn't cover: the rest of the **Doctor/Secretary panel**, and the entire **Admin** surface. Match the established visual language exactly — same colors, type, shape language, spacing, and icon treatment. Do not introduce new tokens, fonts, or a different shape language. Below is the full token spec from the delivered design so you don't have to infer it.

### Design tokens already established (reuse exactly)

**Colors**
| Token | Hex | Usage |
|---|---|---|
| Cream (background) | `#FBF6EF` | App/page background |
| Surface white | `#FFFFFF` | Cards, result rows, inputs |
| Terracotta (primary) | `#E8785A` | Primary buttons, logo mark, active accents |
| Terracotta text | `#C15A3E` | Links, specialty label, primary-outline text |
| Terracotta hover | `#B04A30` | Link hover |
| Terracotta disabled | `#EAD9CF` | Disabled primary button fill |
| Green (secondary) | `#3E6B5C` | "Attended" action button, avatar tint |
| Green deep text | `#2F5C4C` | Positive stat / pill text |
| Green dot | `#4F9C82` | Availability / "today" dot |
| Green pill bg | `#E7F0EA` | Success pill / badge backgrounds |
| WhatsApp green | `#25A566` | WhatsApp send button only |
| Sand | `#D8CBB4` | Neutral accent |
| Sand dot | `#C9BCA5` | Non-today accent |
| Ink (text) | `#2A2521` | Primary text, dark surfaces (toolbar/nav) |
| Muted text | `#8A8175` | Secondary text, captions |
| Body text soft | `#5C554C` | Paragraph body, chip labels |
| Border | `#EEE6DA` / `#E7DFD3` | Card borders / input+chip borders |
| Hairline | `#F0E9DE` / `#F7F2EA` | Inner dividers, subtle bg tints |
| Highlight row bg | `#FCF8F2` | Active/current row highlight |

Avatar tints (cycle by person): Green (bg `#E1EBE4` / text `#3E6B5C`), Terracotta (bg `#F5E0D8` / text `#C15A3E`), Sand (bg `#EFE7D6` / text `#9A7B3E`).

**Typography**: Hanken Grotesk (Google Fonts), weights 400–800, fallback `system-ui, sans-serif`. Screen titles 26px/800/-0.5px (20–22px on mobile). Section headings 15–16px/700. Body 14–15px/400–500, line-height ~1.65. Captions 12–13px/500, muted color. Buttons 13–15px/700.

**Shape/spacing**: Radius `999px` on buttons/pills/avatars; `14–22px` on cards/inputs. Card shadow `0 18px 50px rgba(42,37,33,.12)` (framed) or none (app cards use border-only). Card padding 16–24px. Screen horizontal padding 24px.

**Icons**: Placeholder Unicode glyphs only (matching the existing set: `⌕` search, `✓` check, `✆` phone/WhatsApp, `⌂` location, `↓` sort, `←` back, `☰` menu) — extend this same placeholder style for any new icons needed (e.g. a gear for settings, a calendar for schedule), don't switch to a different icon system.

### Screens already designed — do not redesign, just match their language

Patient site: Home/search, Results, Doctor profile, Booking, Confirmation, Cancel-via-link.
Doctor panel: Dashboard/Today (dark top nav with pills: Hoy, Citas, Confirmaciones, Horarios, Ubicaciones; doctor avatar+name at right; stat grid; "Cola de hoy" queue list with Atendió/No asistió actions).

**Reuse the dashboard's dark top nav shell as the panel's persistent chrome** for every screen below — just add the missing nav destinations to it (Vacaciones, and an account/settings entry) and make the active pill reflect the current screen.

---

## Domain rules that must shape the UI (not just decoration)

- **Secretary vs Doctor — different nav, not just different permissions.** A Secretary account logs into the same panel shell but must **not** see: Locations management, the Doctor's profile/Account settings, Medical History, or anything Subscription-related. Design the nav so these items are conditionally absent for a Secretary, not present-but-disabled. Show both nav states (Doctor nav vs Secretary nav) explicitly as two frames.
- **Medical History is Doctor-only and append-only.** No delete affordance anywhere in this screen — only "add new entry" and "edit existing entry." Design the empty state too: a Doctor who hasn't opted in yet, and a Patient with zero visit history yet (first Attended visit creates the baseline Medical Profile + first Diagnosis Entry together, in one form).
- **A Slot holds multiple Appointments (queue capacity).** Any "add appointment manually" UI must let staff add a walk-in/phone patient into a slot that's already at its patient-facing capacity — make clear this is a staff override, not a bug.
- **Confirmations are a manual WhatsApp send, not automated.** The day-before Confirmations screen's action button opens a pre-filled `wa.me` link (same treatment as the patient Confirmation screen's WhatsApp button, `#25A566`) — staff still taps "send" themselves. After sending, the row should get a way to mark the outcome (confirmed / patient cancelled), it doesn't auto-detect delivery.
- **Onboarding wizard is Doctor-only, first-login only.** A Secretary never sees it. It's multi-step: profile → Locations → Schedule blocks (each block needs its own duration + capacity fields, and a Location can have several blocks across the week).
- **Admin is a founder-only internal tool** — a different audience than Doctor/Secretary, but must still use the same warm design system, not a generic admin-template look. Impersonation is a sensitive, hard-to-undo-looking action (logs in *as* the Doctor/Secretary) — design a confirmation step for it, don't make it a single click.

---

## Surface 2 — Doctor/Secretary panel (remaining screens)

Design **all** of the following. Each needs a desktop frame and a mobile frame (tablet can follow the same fluid rules already used — flex-wrap / `grid auto-fit minmax` / `%`/`max-width`, no fixed breakpoints needed unless a screen genuinely requires one, e.g. a data table).

1. **Login** — centered card on the cream background, email + password fields, primary "Ingresar" button, error state (wrong credentials), forgot-password affordance optional (password resets are Admin-driven per the product, so a "contact your administrator" note is more accurate than a self-serve reset link).
2. **Onboarding wizard** (Doctor only, first login) — a stepper (step indicator using the existing pill/dot language) across: (a) profile info, (b) add one or more Locations (name + address), (c) Schedule blocks per Location (day range, time range, Slot duration, Slot capacity — support adding multiple blocks). Include a review/confirm final step before entering the panel proper.
3. **Appointments list/queue** (fuller version of the dashboard's "today" queue) — filterable by day and by Location (a Doctor with multiple Locations needs to switch between them), same queue-row visual language as the dashboard, plus a "+ Agregar cita" flow (modal or inline form: patient name, phone, slot picker) for manually-entered walk-in/phone patients, and per-row actions to mark Attended/No-show/Cancel.
4. **Day-before Confirmations view** — tomorrow's Appointments list, one WhatsApp-send button per Patient (`#25A566`, same as patient-facing Confirmation screen), and a way to mark each as confirmed or patient-cancelled after the call/message. Badge count in the nav pill (the dashboard nav already reserves a badge slot on "Confirmaciones" — design what populates it).
5. **Schedule editor** — per-Location weekly view of blocks (day, time range, Slot duration, capacity), add/edit/remove a block, Location switcher if the Doctor has more than one.
6. **Vacation editor** — a date-range picker to mark a period unavailable, a list of upcoming/current Vacation periods with a way to remove one before it starts.
7. **Locations management** (Doctor only) — list of Locations (name, address), add new, edit existing. This is the only screen where removing a Location matters — show what happens to a Location that has a Schedule already tied to it (e.g. a confirmation warning) since removing it affects future availability.
8. **Medical History** (Doctor only, opt-in feature) — per-Patient view: baseline Medical Profile (date of birth, blood type, etc. — captured once) at the top, then a reverse-chronological timeline of Diagnosis Entries below (diagnóstico + treatment per visit), each editable but never deletable. Include: the empty state before a Doctor has enabled this feature at all, and the "first visit" combined form (Medical Profile + first Diagnosis Entry captured together when an Appointment is first marked Attended for that Patient).
9. **Account settings** (Doctor only) — Doctor's own profile (editable), Subscription status (view-only — no in-app payment, just "active/inactive" and maybe a renewal date), and a **view-only** list of the Doctor's Secretaries (they're founder-provisioned, so this screen shows who exists, it does not let the Doctor create or invite one).

## Surface 3 — Admin (founder only)

Design a distinct top-level shell for this surface (still on-brand, but visually distinct enough that a founder never confuses it with the patient site or the Doctor/Secretary panel — e.g. a different nav label set: Roster, Analytics, Estado del sistema).

1. **Practice roster** — every onboarded practice (Doctor + optional Secretary), each row/card showing: practice name, Doctor name, whether a Secretary exists, active/inactive status. Search/filter if the list could grow long. Click through to Practice detail.
2. **Create practice** — a form to provision a new Doctor account and, optionally, its Secretary account together in one step (name + contact info for each; this creates bare concierge accounts, not a full onboarding — the Doctor completes their own Onboarding wizard afterward).
3. **Practice detail** — shows the practice's Doctor and Secretary accounts with, per account: deactivate toggle, reset-password action, and an "impersonate" action that requires an explicit confirmation step (e.g. a modal explaining "you'll be logged in as this account, including their Medical History" before proceeding — this is a full-access action per the product's own rules, make that visible in the confirmation copy, not just implied).
4. **Analytics** — business metrics: practices onboarded over time (simple trend, chart placeholder is fine), total Appointments booked, any other at-a-glance platform health numbers. Use the existing stat-grid pattern from the Doctor dashboard as the base pattern, scaled up.
5. **System status** — technical health: database status, deployment status, simple ok/degraded/down indicators (green/terracotta dot + label, reusing the existing dot language from availability indicators elsewhere).

---

## Responsive requirement (no exceptions)

Every screen listed above — all 14 of them, across both surfaces — needs both a desktop frame and a mobile frame, same as the patient-site screens already delivered. If a screen is inherently data-table-heavy (e.g. Practice roster, Analytics), show explicitly how that table degrades on mobile (stacked cards, horizontal scroll with a visible scroll affordance, etc.) rather than leaving it implied.

## Deliverable format

Same as before: an interactive prototype file (`.dc.html` or equivalent — ordinary HTML + inline styles + a plain JS state class is fine, ignore any internal wrapper mechanics) covering real navigation between these screens, plus a static canvas file showing every screen as desktop + mobile frames side by side. Keep file/screen naming consistent with the first round's handoff (`README.md` describing each screen's purpose/layout/interactions, same structure as the existing one) so the two rounds combine into one coherent handoff doc.

## Checklist — confirm every one of these is present before finishing

Doctor/Secretary panel: [ ] Login · [ ] Onboarding wizard · [ ] Appointments list/queue · [ ] Day-before Confirmations · [ ] Schedule editor · [ ] Vacation editor · [ ] Locations management · [ ] Medical History · [ ] Account settings · [ ] Doctor nav vs Secretary nav shown as two distinct states.

Admin: [ ] Practice roster · [ ] Create practice · [ ] Practice detail (with impersonation confirmation step) · [ ] Analytics · [ ] System status.

Every item above has a desktop frame and a mobile frame.
