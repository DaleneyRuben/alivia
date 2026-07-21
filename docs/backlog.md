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
- [ ] Home: top-3 doctors by availability, card → profile directly ([§1](flows/patient-site.md))
- [ ] Home: "Ingresar" link to panel login ([§1](flows/patient-site.md))
- [ ] Search: case-insensitive substring match on specialty or doctor name ([§2](flows/patient-site.md))
- [ ] Results: ranked ascending by soonest available Slot, "próxima cita" pill (green = today, sand = later) ([§2](flows/patient-site.md), [ADR-0008](adr/0008-availability-first-search-no-location-filter.md))
- [ ] Results: empty state "no encontramos especialistas" ([§2](flows/patient-site.md))
- [ ] Doctor profile: Slot picker — available / soonest-highlighted / taken (struck-through, disabled at capacity) ([§3](flows/patient-site.md), [ADR-0009](adr/0009-slots-have-capacity.md))
- [ ] Slot selection surfaces which Location that specific slot is at (`CONTEXT.md`: Location)
- [ ] Booking form: guest name + phone, validation (name > 1 char, phone ≥ 6), submit disabled until valid ([§4](flows/patient-site.md), [ADR-0006](adr/0006-guest-booking-no-patient-accounts.md))
- [ ] Booking submit: creates Appointment + lightweight Patient record → confirmation screen ([§4](flows/patient-site.md))
- [ ] Confirmation screen: appointment summary + "Enviarme la confirmación" wa.me self-send link ([§1](flows/patient-site.md), [ADR-0003](adr/0003-whatsapp-via-manual-links.md))
- [ ] Cancel link (tokenized, no login) → cancel page → confirm/keep → cancelled screen, Slot freed ([§1](flows/patient-site.md))
- [ ] Back navigation: results → home, profile → results, booking → profile ([§1](flows/patient-site.md))

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

- [ ] Add a Desde/Hasta period; list upcoming periods ([§7](flows/doctor-assistant-panel.md))
- [ ] Remove a period before it starts ([§7](flows/doctor-assistant-panel.md))
- [ ] Vacation hides the affected Slots from patients ([lifecycles §2](flows/domain-lifecycles.md))

## 4. Panel — Doctor only

- [ ] Onboarding wizard step 1: Profile ([§2](flows/doctor-assistant-panel.md), [ADR-0005](adr/0005-concierge-doctor-onboarding.md))
- [ ] Onboarding wizard step 2: add one or more Locations (name + address) ([§2](flows/doctor-assistant-panel.md))
- [ ] Onboarding wizard step 3: Schedule blocks per Location tab, with duration + capacity ([§2](flows/doctor-assistant-panel.md))
- [ ] Onboarding wizard step 4: review → "Entrar al panel"; back navigation between steps ([§2](flows/doctor-assistant-panel.md))
- [ ] Onboarding shown on first login only; completing it makes the Doctor appear in patient search ([lifecycles §3](flows/domain-lifecycles.md))
- [x] Locations (Ubicaciones): list, add, edit ([§8](flows/doctor-assistant-panel.md))
- [x] Locations: remove with warning when Schedule blocks exist (blocks deleted, availability stops) ([§8](flows/doctor-assistant-panel.md))
- [ ] Medical History: opt-in empty state → "Activar historia clínica" ([§9](flows/doctor-assistant-panel.md), [ADR-0010](adr/0010-medical-history-optional-in-v1.md))
- [ ] Medical History: patient list with Con historia / Nueva tags ([§9](flows/doctor-assistant-panel.md))
- [ ] Medical History: first-visit combined form — Medical Profile + first Diagnosis Entry ([§9](flows/doctor-assistant-panel.md))
- [ ] Medical History: patient detail — Perfil base + reverse-chron timeline; append entry; edit entry; no delete anywhere ([§9](flows/doctor-assistant-panel.md))
- [ ] Account (Cuenta): editable profile → "Guardar cambios" ([§10](flows/doctor-assistant-panel.md))
- [ ] Account: Subscription view-only (Activa + renewal date) ([§10](flows/doctor-assistant-panel.md), [ADR-0002](adr/0002-no-in-app-payments.md))
- [ ] Account: Assistants view-only list ([§10](flows/doctor-assistant-panel.md), [ADR-0013](adr/0013-assistant-accounts-founder-provisioned.md))

## 5. Admin (founder only)

Source: [`flows/admin.md`](flows/admin.md).

- [ ] Roster: practice cards (practice, doctor + specialty, Con/Sin asistente, Activa/Inactiva dot), search by doctor/practice name ([§1](flows/admin.md))
- [ ] Create practice (Crear consultorio): Doctor account (name, specialty, email, phone) + optional Assistant account (name, email, phone) → sends setup link via WhatsApp ([§2](flows/admin.md), [ADR-0005](adr/0005-concierge-doctor-onboarding.md), [ADR-0013](adr/0013-assistant-accounts-founder-provisioned.md), [ADR-0016](adr/0016-credential-delivery-via-whatsapp.md))
- [ ] Practice detail: Desactivar / Reactivar per account (blocks panel login) ([§3](flows/admin.md))
- [ ] Practice detail: reset password per account → generates a new WhatsApp setup link ([§3](flows/admin.md), [ADR-0016](adr/0016-credential-delivery-via-whatsapp.md))
- [ ] Impersonation: confirmation modal (full access incl. Medical History) → enter that account's panel; action is logged ([§3](flows/admin.md), [ADR-0014](adr/0014-admin-impersonation-full-access.md))
- [ ] Analytics: stat tiles (active practices, appointments booked, attendance rate, assistants, with deltas) + practices-per-month bar chart, wired to real data ([§4](flows/admin.md))
- [ ] System status: overall banner + ok/degraded/down rows (Database, Deployment, WhatsApp link generation, Scheduled jobs) ([§5](flows/admin.md))

## 6. Cross-cutting domain rules

Server-side invariants from [`flows/domain-lifecycles.md`](flows/domain-lifecycles.md) —
each needs enforcement and tests regardless of which screen drives it.

- [ ] Appointment lifecycle: Scheduled (Unconfirmed/Confirmed) → Attended | No-show | Cancelled; final states immutable ([§1](flows/domain-lifecycles.md))
- [ ] Confirmation is a sub-state of Scheduled, never terminal ([§1](flows/domain-lifecycles.md))
- [ ] Capacity is a hard cap for patient self-booking only; staff may exceed it ([§2](flows/domain-lifecycles.md), [ADR-0009](adr/0009-slots-have-capacity.md))
- [ ] Cancelling an Appointment reopens its Slot when below capacity ([§2](flows/domain-lifecycles.md))
- [ ] Marking Attended by the Doctor (opted in) triggers the Diagnosis Entry flow; first Attended visit also creates the Medical Profile ([§1, §4](flows/domain-lifecycles.md))
- [ ] Medical History siloing: invisible to other Doctors and to Assistants; only exception is Admin impersonation ([§4](flows/domain-lifecycles.md), [ADR-0011](adr/0011-medical-history-siloed-per-doctor.md), [ADR-0014](adr/0014-admin-impersonation-full-access.md))
- [ ] Diagnosis Entries: editable, never deletable ([§4](flows/domain-lifecycles.md))
- [ ] Assistant permission boundary enforced server-side (not just hidden nav): no Locations, Account/Subscription, or Medical History access (`CONTEXT.md`: Assistant)
- [ ] Patient records deduplicated/keyed by phone per practice, with appointment history (`CONTEXT.md`: Patient)

## 7. Ship

- [x] CI: lint, typecheck, frontend tests, backend tests ([project-standards](../.claude/skills/project-standards/SKILL.md))
- [ ] Production deployment + environment config ([ADR-0012](adr/0012-mvp-tech-stack.md))
