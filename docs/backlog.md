# Backlog — build tracker

Every case we need to build for v1, extracted from the flow docs
([`flows/`](flows/)), `CONTEXT.md`, and the ADRs ([`adr/`](adr/)). This is the
single place to see what's done, in progress, or missing.

**How to use**

- One checkbox per case. `[x]` = done (merged to `main` and verified),
  `[ ]` = not started. Mark in-progress work by appending **🚧 branch-name**.
- Update this file in the same PR that completes a case.
- Each case links its source — the flow doc section or ADR that defines it. If a
  case seems ambiguous, the source wins; if the source is silent, ask before
  inventing behavior.

---

## 0. Docs & design (done — kept for the record)

- [x] Domain language (`CONTEXT.md`)
- [x] ADRs 0001–0014 ([`adr/`](adr/))
- [x] Design briefs ([`design-brief.md`](design-brief.md), [`design-brief-panel-admin.md`](design-brief-panel-admin.md)) and prototypes (`design/`)
- [x] Flow diagrams: patient site, panel, admin, domain lifecycles ([`flows/`](flows/))

## 1. Foundation

Schema and rules per [`flows/domain-lifecycles.md`](flows/domain-lifecycles.md);
stack per [ADR-0012](adr/0012-mvp-tech-stack.md).

- [x] Prisma schema: Doctor, Assistant, Location, Schedule block, Appointment, Patient ([lifecycles §1–3](flows/domain-lifecycles.md))
- [x] Prisma schema: Medical History — Medical Profile + Diagnosis Entry, scoped per Doctor–Patient pair ([lifecycles §4](flows/domain-lifecycles.md), [ADR-0011](adr/0011-medical-history-siloed-per-doctor.md))
- [x] Prisma schema: Vacation periods (per Doctor or per Location) (`CONTEXT.md`: Vacation)
- [x] Prisma schema: Subscription record (view-only data, no billing) ([ADR-0002](adr/0002-no-in-app-payments.md))
- [x] Auth: email + password sessions for Doctor / Assistant / Admin roles ([panel §1](flows/doctor-assistant-panel.md))
- [x] Credential setup/reset links: token generation + pre-filled wa.me link builder, reused for first-time setup and admin-driven resets ([ADR-0016](adr/0016-credential-delivery-via-whatsapp.md))
- [x] Route guards: panel requires login; doctor-only routes reject an Assistant (redirect to Citas); admin routes founder-only ([panel §3](flows/doctor-assistant-panel.md), [admin](flows/admin.md))
- [x] Slot generation: Schedule block × Slot duration × capacity → bookable Slots ([lifecycles §2](flows/domain-lifecycles.md))
- [x] Seed script: sample practice(s) for local dev

## 2. Patient site (public, no login)

Source: [`flows/patient-site.md`](flows/patient-site.md).

- [x] Home: search input + specialty chips ([§1](flows/patient-site.md))
- [x] Home: top-3 doctors by availability, "Reservar" → profile directly ([§1](flows/patient-site.md))
- [x] Home: no "Ingresar" link — panel login reached via a separately shared direct link ([§1](flows/patient-site.md))
- [x] Search: case-insensitive substring match on specialty or doctor name ([§2](flows/patient-site.md))
- [x] Results: ranked ascending by soonest available Slot, "próxima cita" pill (green = today, sand = later) ([§2](flows/patient-site.md), [ADR-0008](adr/0008-availability-first-search-no-location-filter.md))
- [x] Results: empty state "no encontramos especialistas" ([§2](flows/patient-site.md))
- [x] Doctor profile: Slot picker — available / soonest-highlighted / taken (struck-through, disabled at capacity) ([§3](flows/patient-site.md), [ADR-0009](adr/0009-slots-have-capacity.md))
- [x] Slot selection surfaces which Location that specific slot is at (`CONTEXT.md`: Location)
- [x] Booking form: guest name + phone, validation (name > 1 char, phone ≥ 6), submit disabled until valid ([§4](flows/patient-site.md), [ADR-0006](adr/0006-guest-booking-no-patient-accounts.md))
- [x] Booking submit: creates Appointment + lightweight Patient record → confirmation screen ([§4](flows/patient-site.md))
- [x] Confirmation screen: appointment summary + "Enviarme la confirmación" wa.me self-send link ([§1](flows/patient-site.md), [ADR-0003](adr/0003-whatsapp-via-manual-links.md))
- [x] Cancel link (tokenized, no login) → cancel page → confirm/keep → cancelled screen, Slot freed ([§1](flows/patient-site.md))
- [x] Back navigation: results → home, profile → results, booking → profile ([§1](flows/patient-site.md))

## 3. Panel — shared (Doctor and Assistant)

Source: [`flows/doctor-assistant-panel.md`](flows/doctor-assistant-panel.md).

### Login & shell

- [x] Login screen with error banner "Correo o contraseña incorrectos" ([§1](flows/doctor-assistant-panel.md))
- [x] Role routing: Doctor first login → onboarding; Doctor returning → Citas; Assistant → Citas ([§1](flows/doctor-assistant-panel.md))
- [x] "¿Olvidaste tu contraseña?" → no self-serve reset notice ([§1](flows/doctor-assistant-panel.md))
- [x] Nav shell: doctor-only items (Ubicaciones, Historial, Cuenta) absent from DOM for an Assistant ([§3](flows/doctor-assistant-panel.md))

### Appointments (Citas)

- [x] Queue list filtered by Day (Hoy / Mañana) + Location switcher ([§4](flows/doctor-assistant-panel.md))
- [x] Manual add: patient name, phone, Slot pick — "Walk-in" tag ([§4](flows/doctor-assistant-panel.md))
- [x] Over-capacity staff override with amber notice ([§4](flows/doctor-assistant-panel.md), [ADR-0009](adr/0009-slots-have-capacity.md))
- [x] Per-row actions while pending: Atendió / No asistió / Cancelar (cancel frees the Slot) ([§4](flows/doctor-assistant-panel.md))
- [x] "Siguiente" marker advances to next pending row after Attended/No-show ([§4](flows/doctor-assistant-panel.md))

### Confirmations (Confirmaciones)

- [x] List of tomorrow's Appointments with pending/confirmed state ([§5](flows/doctor-assistant-panel.md))
- [x] Pre-filled wa.me link per row (manual send, no automation) ([§5](flows/doctor-assistant-panel.md), [ADR-0003](adr/0003-whatsapp-via-manual-links.md))
- [x] Mark Confirmó / Canceló per row; cancel frees the Slot ([§5](flows/doctor-assistant-panel.md))
- [x] Pending count feeds the nav badge ([§5](flows/doctor-assistant-panel.md))

### Schedule (Horarios)

- [x] Per-Location block list with Location switcher ([§6](flows/doctor-assistant-panel.md), [ADR-0004](adr/0004-schedule-per-location.md))
- [x] Add / edit / remove a block (days, time range, Slot duration, capacity) ([§6](flows/doctor-assistant-panel.md))

### Vacation (Vacaciones)

- [x] Add a Desde/Hasta period; list upcoming periods ([§7](flows/doctor-assistant-panel.md))
- [x] Remove a period before it starts ([§7](flows/doctor-assistant-panel.md))
- [x] Vacation hides the affected Slots from patients ([lifecycles §2](flows/domain-lifecycles.md))

## 4. Panel — Doctor only

- [x] Onboarding wizard step 1: Profile ([§2](flows/doctor-assistant-panel.md), [ADR-0005](adr/0005-concierge-doctor-onboarding.md))
- [x] Onboarding wizard step 2: add one or more Locations (name + address) ([§2](flows/doctor-assistant-panel.md))
- [x] Onboarding wizard step 3: Schedule blocks per Location tab, with duration + capacity ([§2](flows/doctor-assistant-panel.md))
- [x] Onboarding wizard step 4: review → "Entrar al panel"; back navigation between steps ([§2](flows/doctor-assistant-panel.md))
- [x] Onboarding shown on first login only; completing it makes the Doctor appear in patient search ([lifecycles §3](flows/domain-lifecycles.md))
- [x] Locations (Ubicaciones): list, add, edit ([§8](flows/doctor-assistant-panel.md))
- [x] Locations: remove with warning when Schedule blocks exist (blocks deleted, availability stops) ([§8](flows/doctor-assistant-panel.md))
- [x] Medical History: opt-in empty state → "Activar historia clínica" ([§9](flows/doctor-assistant-panel.md), [ADR-0010](adr/0010-medical-history-optional-in-v1.md))
- [x] Medical History: patient list with Con historia / Nueva tags ([§9](flows/doctor-assistant-panel.md))
- [x] Medical History: first-visit combined form — Medical Profile + first Diagnosis Entry ([§9](flows/doctor-assistant-panel.md))
- [x] Medical History: patient detail — Perfil base + reverse-chron timeline; append entry; edit entry; no delete anywhere ([§9](flows/doctor-assistant-panel.md))
- [x] Account (Cuenta): editable profile → "Guardar cambios" ([§10](flows/doctor-assistant-panel.md))
- [x] Account: Subscription view-only (Activa + renewal date) ([§10](flows/doctor-assistant-panel.md), [ADR-0002](adr/0002-no-in-app-payments.md))
- [x] Account: Assistants view-only list ([§10](flows/doctor-assistant-panel.md), [ADR-0013](adr/0013-assistant-accounts-founder-provisioned.md))

## 5. Admin (founder only)

Source: [`flows/admin.md`](flows/admin.md).

- [x] Roster: practice cards (practice, doctor + specialty, Con/Sin asistente, Activa/Inactiva dot), search by doctor/practice name ([§1](flows/admin.md))
- [x] Create practice (Crear consultorio): Doctor account (name, specialty, email, phone) + optional Assistant account (name, email, phone) → sends setup link via WhatsApp ([§2](flows/admin.md), [ADR-0005](adr/0005-concierge-doctor-onboarding.md), [ADR-0013](adr/0013-assistant-accounts-founder-provisioned.md), [ADR-0016](adr/0016-credential-delivery-via-whatsapp.md))
- [x] Practice detail: Desactivar / Reactivar per account (blocks panel login) ([§3](flows/admin.md))
- [x] Practice detail: reset password per account → generates a new WhatsApp setup link ([§3](flows/admin.md), [ADR-0016](adr/0016-credential-delivery-via-whatsapp.md))
- [x] Impersonation: confirmation modal (full access incl. Medical History) → enter that account's panel; action is logged ([§3](flows/admin.md), [ADR-0014](adr/0014-admin-impersonation-full-access.md))
- [x] Analytics: stat tiles (active practices, appointments booked, attendance rate, assistants, with deltas) + practices-per-month bar chart, wired to real data ([§4](flows/admin.md))
- [x] System status: overall banner + ok/degraded/down rows (Database, Deployment, WhatsApp link generation, Scheduled jobs) ([§5](flows/admin.md))

## 6. Cross-cutting domain rules

Server-side invariants from [`flows/domain-lifecycles.md`](flows/domain-lifecycles.md) —
each needs enforcement and tests regardless of which screen drives it.

- [x] Appointment lifecycle: Scheduled (Unconfirmed/Confirmed) → Attended | No-show | Cancelled; final states immutable ([§1](flows/domain-lifecycles.md))
- [x] Confirmation is a sub-state of Scheduled, never terminal ([§1](flows/domain-lifecycles.md))
- [x] Capacity is a hard cap for patient self-booking only; staff may exceed it ([§2](flows/domain-lifecycles.md), [ADR-0009](adr/0009-slots-have-capacity.md))
- [x] Cancelling an Appointment reopens its Slot when below capacity ([§2](flows/domain-lifecycles.md))
- [x] Marking Attended by the Doctor (opted in) triggers the Diagnosis Entry flow; first Attended visit also creates the Medical Profile ([§1, §4](flows/domain-lifecycles.md))
- [x] Medical History siloing: invisible to other Doctors and to Assistants; only exception is Admin impersonation ([§4](flows/domain-lifecycles.md), [ADR-0011](adr/0011-medical-history-siloed-per-doctor.md), [ADR-0014](adr/0014-admin-impersonation-full-access.md))
- [x] Diagnosis Entries: editable, never deletable ([§4](flows/domain-lifecycles.md))
- [x] Assistant permission boundary enforced server-side (not just hidden nav): no Locations, Account/Subscription, or Medical History access (`CONTEXT.md`: Assistant)
- [x] Patient records deduplicated/keyed by phone per practice, with appointment history (`CONTEXT.md`: Patient)

## 7. Post-exploration UX fixes

Design already updated in `design/`; not yet implemented. Source: decisions recorded in
[`exploration-findings.md`](exploration-findings.md).

- [x] Panel & Admin nav: logout via avatar-click dropdown ("Salir"), wired to `signOut()` ([finding #1](exploration-findings.md#1-no-logout-control-in-the-paneladmin-nav))
- [x] Patient home: remove "Ingresar" button (`/login` stays live, just unlinked) ([finding #2](exploration-findings.md#2-remove-ingresar-from-the-patient-site--staff-will-get-a-separate-direct-link))
- [x] Shared phone-input component (country-flag dropdown, full country list, Bolivia preselected, E.164 storage) reused across Booking, the staff walk-in form, and Crear consultorio's doctor/assistant fields; remove Booking's reassurance line + placeholders ([finding #3](exploration-findings.md#3-booking-form-copyplaceholders-plus-a-country-code-dropdown-for-phone-numbers))
- [x] Doctor profile page: remove the Ubicaciones list, add a per-slot location label, add a calendar date-picker over the existing 14-day availability window ([finding #4](exploration-findings.md#4-doctor-profile-page-patient-site--ubicaciones-date-range-and-a-lead-time-rule))
- [x] Doctor profile / booking: enforce a 2-hour minimum lead time on bookable slots, patient self-booking only — staff's "+ Agregar cita" stays unaffected ([finding #4](exploration-findings.md#4-doctor-profile-page-patient-site--ubicaciones-date-range-and-a-lead-time-rule))
- [x] Horarios: reject a schedule block that overlaps another of the doctor's blocks in weekday + time range across locations, with a clear in-UI error ([finding #5](exploration-findings.md#5-horarios-schedule-editor--a-doctor-can-create-impossible-double-booked-availability))
- [x] Result card (Home + Results): remove the whole-card link — only "Reservar" navigates to the profile ([finding #6](exploration-findings.md#6-result-card-home--results--whole-card-is-clickable-only-reservar-should-be))

## 8. Post-exploration UX fixes, round 2

Design already updated in `design/`; not yet implemented. Source: decisions recorded in
[`exploration-findings-2.md`](exploration-findings-2.md).

- [ ] Home + Results: merge into a single page — chip/search updates the doctor list in place and syncs the active specialty/search term into the URL, replacing the separate `/results` route ([finding #1](exploration-findings-2.md#1-home-searchspecialty-chips-navigate-to-a-separate-page-instead-of-filtering-in-place))
- [ ] Doctor profile page: drop the two-column split — "Sobre el doctor" full-width on top, compact left-aligned calendar + 3-column slot grid stacked below, at every screen width ([finding #2](exploration-findings-2.md#2-doctor-profile-page--two-column-layout-leaves-the-left-column-mostly-empty))
- [ ] App-wide: a fade transition on every route change (all 21 routes) via Next.js View Transitions, no new dependency ([finding #3](exploration-findings-2.md#3-no-page-transition-animation-and-no-loading-skeletons-anywhere))
- [ ] App-wide: a `loading.tsx` per route (all 21 routes), each skeleton shaped to that page's own content rather than one generic spinner ([finding #3](exploration-findings-2.md#3-no-page-transition-animation-and-no-loading-skeletons-anywhere))
- [ ] Login: reusable `PasswordInput` component with a show/hide eye-glyph toggle, swapped into `LoginForm` (and assumed for the future `/set-password` screen) ([finding #4](exploration-findings-2.md#4-login-page--password-field-has-no-showhide-toggle))
- [ ] Phone input: replace the bare native `<select>` arrow with a styled `▾` chevron (matching `UserMenu`'s pattern) across all four country-code dropdown instances ([finding #5](exploration-findings-2.md#5-phone-input-country-code-dropdown--bare-native-arrow-cramped-against-the-dial-code))
- [ ] Citas queue: rename "Atendió"/"Atendido" → "Asistió" everywhere, so the button and status pill share the same verb family as "No asistió" ([finding #6](exploration-findings-2.md#6-citas-queue--atendió-copy-mismatch-and-no-future-time-guard-on-attendedno-show))
- [ ] Citas queue: hide Asistió/No asistió until the appointment's scheduled time has passed, enforced both client-side and server-side in `updateAppointmentStatus` ([finding #6](exploration-findings-2.md#6-citas-queue--atendió-copy-mismatch-and-no-future-time-guard-on-attendedno-show))
- [ ] Shared `ConfirmDialog` component, wired into all 9 destructive actions app-wide (Cancelar, Canceló, Desactivar/Reactivar, Restablecer contraseña, Vacation Quitar, Location Quitar, Schedule block Quitar, plus migrating the existing impersonation modal and Location-with-blocks banner onto it) ([finding #7](exploration-findings-2.md#7-most-destructive-actions-fire-immediately-no-confirmation-step--caused-a-real-accidental-cancellation))
- [ ] Confirmaciones queue: exclude cancelled appointments from `getConfirmationsQueue` entirely instead of rendering a "Canceló" pill ([finding #8](exploration-findings-2.md#8-confirmaciones-queue--cancelled-appointments-should-drop-off-the-list-not-stay-visible))
- [ ] Horarios: replace the native `type="time"` inputs with a custom hour/minute dropdown control for Hora de inicio/Hora de fin ([finding #9](exploration-findings-2.md#9-horarios--native-typetime-inputs-look-bad-and-deviate-from-the-design))
- [ ] Vacaciones: add an "Editar" action per period (pre-fills the form, gated by the same before-start rule as Quitar) ([finding #10](exploration-findings-2.md#10-vacaciones--no-edit-affordance-and-no-overlap-validation-between-periods))
- [ ] Vacaciones: add cross-period overlap validation on create/edit (`vacationsOverlap`, null-locationId as wildcard on both sides) ([finding #10](exploration-findings-2.md#10-vacaciones--no-edit-affordance-and-no-overlap-validation-between-periods))

## 9. Ship

- [x] CI: lint, typecheck, frontend tests, backend tests ([project-standards](../.claude/skills/project-standards/SKILL.md))
- [x] Production deployment + environment config ([ADR-0012](adr/0012-mvp-tech-stack.md))
