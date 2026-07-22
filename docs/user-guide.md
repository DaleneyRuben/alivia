# Alivia — User Guide

This is a walkthrough of every screen in Alivia, written for someone opening the app for the
first time. It assumes the app is running locally at `http://localhost:3000` (start it with
`yarn dev` if it isn't already running).

Alivia has **three separate experiences** that don't share a login:

| Experience                                                 | Who uses it                                           | Login required? |
| ---------------------------------------------------------- | ----------------------------------------------------- | --------------- |
| [Patient site](#part-a--patient-site-no-login)             | Anyone searching for a doctor and booking a visit     | No              |
| [Doctor / Assistant panel](#part-b--doctorassistant-panel) | The doctor and their assistant, managing one practice | Yes             |
| [Admin](#part-c--admin-founder-view)                       | The founder, managing every practice on the platform  | Yes             |

For vocabulary (what "Slot", "Location", "Confirmation" etc. mean precisely), see
[`CONTEXT.md`](../CONTEXT.md) — this guide assumes you've skimmed it and focuses on _where to
click_, not on redefining terms.

---

## Test accounts (seeded locally)

Running `yarn db:seed` populates the local database with one admin, ten doctors covering ten
specialties, and a mix of assistants, locations, schedules, vacations, patients, and medical
history — enough to exercise almost every screen and edge case in the app. All accounts share the
password **`alivia123`**.

| Email                            | Role                      | Notes                                                                                                                                                            |
| -------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin@alivia.bo`                | Admin                     | Founder view — [`/admin`](http://localhost:3000/admin)                                                                                                           |
| `doctor@alivia.bo`               | Doctor (Pediatría)        | Fully onboarded, has an assistant, medical history enabled, 10 patients covering every appointment status, an over-capacity walk-in, and a cancelled appointment |
| `asistente@alivia.bo`            | Assistant                 | Linked to `doctor@alivia.bo`                                                                                                                                     |
| `doctor.nuevo@alivia.bo`         | Doctor (Medicina General) | **Not onboarded yet** — logging in drops you straight into the [onboarding wizard](#first-login--onboarding-wizard-doctor-only)                                  |
| `doctor.dermatologia@alivia.bo`  | Doctor (Dermatología)     | Simple case, one location, three patients                                                                                                                        |
| `doctor.cardiologia@alivia.bo`   | Doctor (Cardiología)      | Has an assistant and **two locations** — good for testing the location switcher                                                                                  |
| `doctor.ginecologia@alivia.bo`   | Doctor (Ginecología)      | Subscription is **inactive** — check how the "Cuenta" page renders this                                                                                          |
| `doctor.traumatologia@alivia.bo` | Doctor (Traumatología)    | Account is **deactivated** — login should be blocked                                                                                                             |
| `doctor.psicologia@alivia.bo`    | Doctor (Psicología)       | Two patients                                                                                                                                                     |
| `doctor.odontologia@alivia.bo`   | Doctor (Odontología)      | Medical history enabled, a patient with three visits/diagnosis entries                                                                                           |
| `doctor.nutricion@alivia.bo`     | Doctor (Nutrición)        | One cancelled appointment                                                                                                                                        |
| `doctor.oftalmologia@alivia.bo`  | Doctor (Oftalmología)     | Onboarded today — good for "brand new practice" scenarios                                                                                                        |

There's no logout button anywhere in the panel currently — see the note in [Login](#login).
Switching between test accounts means clearing cookies or using a private window.

---

## Part A — Patient site (no login)

This is what a patient in La Paz sees when they search for a doctor. Nobody needs an account here.

### Home — [`/`](http://localhost:3000/)

The landing page: a big "¿Qué especialista necesitas?" search box plus a row of quick-pick
specialty chips (Cardiología, Pediatría, Dermatología, Medicina general), and below that a
"featured doctors" strip showing the **top 3 doctors platform-wide by soonest available slot** —
not by any manual ranking. A doctor whose earliest slot happens to be full is pushed down the list
automatically (see ADR-0008); that's expected, not a bug.

Typing a specialty or a doctor's name and hitting "Buscar" — or clicking a chip — takes you to
Results.

### Results — [`/results?specialty=...`](http://localhost:3000/results?specialty=cardiolog%C3%ADa)

A filtered list of doctors matching the query (specialty or name, partial match). Each result
card shows the doctor's name, specialty, and their soonest available slot label ("Hoy 10:00",
"Mañana 09:30", etc.). Clicking a card opens that doctor's profile.

### Doctor profile — `/doctors/[doctorId]`

Shows:

- Name, specialty, years of experience, university, a short bio, and a "Colegio Médico
  verificado" badge (cosmetic trust signal).
- All of the doctor's **Locations** (name + address).
- A slot picker for the next available day with open slots — grouped by time, greyed out if full.

Picking a slot takes you to Booking.

### Booking — `/booking?doctorId=...&locationId=...&date=...&start=...`

A confirmation card showing doctor, location, date, and time, plus two fields: full name and
WhatsApp phone number. No account or password is created — this is a guest booking. Submitting
creates the Appointment (source `PATIENT`) and redirects to the booking's Confirmation page.

If the slot filled up between picking it and submitting, the form shows "Este horario ya no está
disponible" instead of the name/phone fields.

### Confirmation (booking receipt) — `/confirmation/[token]`

The page a patient lands on right after booking, and the page any link in their confirmation
message points to. Shows the appointment details and a way to cancel. The `token` is a
per-appointment secret — this is how a patient can manage their booking with **no login**.

### Cancel — `/cancel/[token]`

Reached from a "cancel your appointment" link (e.g. sent via WhatsApp). Shows a confirmation
prompt ("¿Cancelar tu cita?"); confirming frees the slot immediately. Once cancelled, the page
flips to a "Tu cita fue cancelada" state with a link back to search for another time.

---

## Part B — Doctor/Assistant panel

### Login — [`/login`](http://localhost:3000/login)

Email + password. A **Doctor** and their **Assistant** log in with separate accounts but land in
the same panel shell, just with a different set of nav items (see below). A deactivated account
(`doctor.traumatologia@alivia.bo` in the seed data) is blocked at login.

> **There is no logout button anywhere in the panel.** To switch test accounts, clear cookies or
> open a private/incognito window and log in again.

### First login → Onboarding wizard (Doctor only)

If a Doctor account has never been onboarded (`doctor.nuevo@alivia.bo` in the seed data), logging
in sends them to [`/panel/onboarding`](http://localhost:3000/panel/onboarding) instead of the
panel. It's a 4-step wizard and you can't skip ahead until each step is valid:

1. **Perfil** — name, specialty, phone, and the optional fields (practice name, years of
   experience, university, bio).
2. **Ubicaciones** — add at least one Location (name + address). You can't advance with zero.
3. **Horarios** — add Schedule blocks to those locations (see [Horarios](#horarios) below for what
   a block is).
4. **Revisar** — a read-only summary of everything entered; "Entrar al panel" finishes onboarding
   and drops you into Citas.

Assistants never see this wizard — onboarding is Doctor-only, matching the concierge-account
pattern in [ADR-0005](../adr/0005-concierge-doctor-onboarding.md).

### The navigation bar

Every panel page shares the same top nav (dark bar, "Alivia" logo on the left, role badge —
Doctor/Asistente — on the right). The links shown depend on role:

| Nav item                                   | Doctor | Assistant |
| ------------------------------------------ | ------ | --------- |
| Citas                                      | ✅     | ✅        |
| Confirmaciones (badge shows pending count) | ✅     | ✅        |
| Horarios                                   | ✅     | ✅        |
| Vacaciones                                 | ✅     | ✅        |
| Ubicaciones                                | ✅     | ❌        |
| Historial                                  | ✅     | ❌        |
| Cuenta                                     | ✅     | ❌        |

This mirrors the domain rule that Assistants can run day-to-day operations but never touch
structural/sensitive things (locations, profile, subscription, medical history) — see the
"Assistant" entry in [`CONTEXT.md`](../CONTEXT.md).

### Citas — [`/panel/appointments`](http://localhost:3000/panel/appointments)

The daily queue — this is the screen a doctor/assistant lives in most of the day.

- **Hoy / Mañana** toggle switches which day's queue you're viewing.
- A **location switcher** (only relevant if the doctor has more than one Location, e.g.
  `doctor.cardiologia@alivia.bo`) filters the queue to one location's appointments.
- Each row shows the time, patient name + phone, and a status action:
  - Pending appointments (status `SCHEDULED`) get three buttons: **Atendió**, **No asistió**,
    **Cancelar**.
  - Already-resolved appointments show a pill instead: "Atendido", "No asistió", or "Cancelada".
  - The very next pending appointment in the queue is tagged **"Siguiente"** — this is purely the
    first `SCHEDULED` row in time order, not a separate flag.
  - A walk-in entered by staff (rather than self-booked by the patient) is tagged **"Walk-in"**.
- **"+ Agregar cita"** opens a manual-booking form for a patient who called or walked in. You pick
  a time slot from that location/day's available cupos. If you pick a slot that's already at
  capacity, it's shown with a "· lleno" label and a warning: _"Este cupo ya alcanzó su capacidad
  para pacientes. Puedes sobrecuparlo como excepción del personal — el paciente se sumará a la
  cola."_ This is intentional — capacity is a soft cap for staff, hard only for patient
  self-booking (see the "Slot" definition in `CONTEXT.md`).

### Confirmaciones — [`/panel/confirmations`](http://localhost:3000/panel/confirmations)

The day-before check-in queue: every appointment scheduled for **tomorrow**, regardless of
location. For each pending one you get:

- A **WhatsApp** button — opens a `wa.me` link pre-filled to message that patient (sending is
  manual; the app doesn't auto-send anything).
- **Confirmó** — marks the appointment's confirmation status `CONFIRMED`.
- **Canceló** — cancels the appointment outright, freeing the slot.

Already-resolved rows show a "✓ Confirmó" or "Canceló" pill instead of buttons. The header shows a
running count of pending confirmations, and that same count is what badges the "Confirmaciones"
nav link platform-wide.

### Horarios — [`/panel/schedule`](http://localhost:3000/panel/schedule)

Defines the recurring weekly availability for whichever Location is selected in the switcher at
the top. Each **Schedule block** is: which weekdays it applies to (Lun–Dom, multi-select), a start
time, an end time, a slot duration in minutes, and a slot capacity (max simultaneous patients per
slot). A location can have several blocks — e.g. a tighter-capacity morning block and a
looser-capacity afternoon block. Add, edit, or remove blocks freely; changes apply to future slot
generation immediately.

### Vacaciones — [`/panel/vacation`](http://localhost:3000/panel/vacation)

Marks a date range as unavailable, either for one specific Location or for the whole practice
(all locations). During that range, the patient site won't offer any slots for the affected
location(s). The page lists upcoming vacation periods with a remove option.

### Ubicaciones — [`/panel/locations`](http://localhost:3000/panel/locations) _(Doctor only)_

Add, edit, or remove physical Locations (name + address). Each location's card shows how many
Schedule blocks it currently has. This is deliberately Doctor-only — Assistants can manage the
Schedule _inside_ an existing Location, but can't add or remove Locations themselves.

### Historial — [`/panel/history`](http://localhost:3000/panel/history) _(Doctor only, opt-in)_

Medical History is off by default per doctor. If it hasn't been turned on, this page shows a
single opt-in screen explaining the feature ("registro clínico privado... nunca se comparte con
secretarias ni otros doctores") with an **"Activar historia clínica"** button.

Once enabled, the page becomes a patient list. Each patient is tagged:

- **"Nueva"** — no Attended appointment yet, so there's no Medical History for them.
- **"Con historia"** — has at least one recorded visit.

Clicking a patient opens `/panel/history/[patientId]`:

- If they have **no Medical Profile yet**, you get the **first-visit form**: baseline fields
  (date of birth, blood type, allergies/history) _plus_ the first diagnosis entry (diagnóstico +
  tratamiento), saved together in one submit. This only succeeds if the patient has at least one
  Attended appointment — otherwise it shows an inline error.
- If they **already have a profile**, you instead see:
  - A **Perfil base** card (date of birth, blood type, allergies) with its own "Editar" toggle.
  - A **Historial de visitas** timeline of every diagnosis entry, newest first, each individually
    editable via "Editar" — but note the footer text: _"Las notas anteriores se pueden editar,
    pero nunca eliminar."_ Entries can never be deleted, only edited or added to.

This whole page is invisible to Assistants — there is no route guard bypass; an Assistant session
hitting `/panel/history` is blocked the same as any other Doctor-only page.

### Cuenta — [`/panel/account`](http://localhost:3000/panel/account) _(Doctor only)_

Three stacked cards:

1. **Perfil** — the same profile fields as onboarding step 1 (name, specialty, phone, practice
   name, years of experience, university, bio), editable inline.
2. **Suscripción** — read-only status (Activa/Inactiva) and renewal date. Note the copy: _"El pago
   se gestiona fuera de la app. Para cambios de plan, contacta a tu administrador"_ — there's no
   in-app billing, matching the "Subscription" definition in `CONTEXT.md`.
3. **Asistentes** — a read-only list of the doctor's assistant(s). The subtitle says
   _"Gestionadas por tu administrador"_ — a Doctor can see their assistants here but can't add,
   remove, or edit them; that's Admin-only (see [Crear consulta](#crear-consulta--admincreate)).

---

## Part C — Admin (founder) view

Logging in as `admin@alivia.bo` lands you in a completely separate shell (its own nav bar, marked
with an "ADMIN" badge) — this is the founder's own tool, never accessible to a Doctor or
Assistant.

### Roster — [`/admin`](http://localhost:3000/admin)

The default landing page: every practice (Doctor + optional Assistant) on the platform, one row
per practice. Each row shows the doctor's initials/avatar, practice name, doctor name +
specialty, a "Con asistente"/"Sin asistente" pill, and an "Activa"/"Inactiva" status pill. A search
box filters by doctor name or practice name. Clicking a row opens that practice's detail page.
**"+ Crear consulta"** in the top right starts the account-creation flow.

### Crear consulta — [`/admin/create`](http://localhost:3000/admin/create)

The concierge account-creation form (ADR-0005): fill in the doctor's name, specialty, email, and
phone; optionally expand "+ Agregar" under "Cuenta de asistente" to create an assistant account at
the same time. Submitting creates bare, name-only accounts — **the doctor completes their own
setup** via the onboarding wizard the first time they log in. After creation, you get a
"Cuentas creadas" screen with a WhatsApp-shareable setup link per account, so the founder can send
each person a link to set their own password.

### Practice detail — `/admin/[practiceId]`

Reached by clicking a roster row. Shows the practice header (name, doctor, specialty, overall
active/inactive status) and a card per linked account (Doctor and, if present, Assistant), each
with three actions:

- **Desactivar / Reactivar** — toggles that account's `active` flag. A deactivated account can no
  longer log in (this is what blocks `doctor.traumatologia@alivia.bo` in the seed data).
- **Restablecer contraseña** — generates a new password-setup link, surfaced as a WhatsApp-send
  button, same pattern as account creation.
- **Iniciar sesión como…** — impersonation. This opens a confirmation modal first (_"Entrarás al
  panel con acceso completo de esta cuenta, incluida su historia clínica. Esta acción queda
  registrada. Úsala solo para dar soporte."_) before actually switching into that account's
  session — every impersonation is logged (`ImpersonationLog` in the schema).

### Analytics — [`/admin/analytics`](http://localhost:3000/admin/analytics)

Platform-wide business metrics: stat cards (e.g. doctors onboarded, appointments booked,
attendance rate, assistants) plus a bar chart of practices onboarded per month.

### Estado del sistema — [`/admin/status`](http://localhost:3000/admin/status)

Technical health check — a banner ("Todos los sistemas operativos" or a degraded/down warning)
plus a row per monitored system (e.g. database, deployment) each with its own Operativo/Degradado/
Caído badge.

---

## Suggested test walkthrough

A path that touches most of the app in one pass, using the seeded accounts:

1. **Patient site, no login**: search "pediatr" on the home page → open Valeria Rojas's profile
   → book a slot as a guest → cancel it from the confirmation page.
2. **Doctor with full data**: log in as `doctor@alivia.bo` / `alivia123` → check Citas (note the
   "Siguiente" and "Walk-in" tags, and the over-capacity slot) → Confirmaciones → Historial (open
   a "Con historia" patient to see the diagnosis timeline, then a "Nueva" one to see the
   first-visit form) → Cuenta.
3. **Multi-location doctor**: log in as `doctor.cardiologia@alivia.bo` → use the location switcher
   in Citas and Horarios.
4. **Brand-new doctor**: clear cookies, log in as `doctor.nuevo@alivia.bo` → walk through all 4
   onboarding steps.
5. **Blocked login**: clear cookies, try `doctor.traumatologia@alivia.bo` → confirm login is
   refused.
6. **Admin**: clear cookies, log in as `admin@alivia.bo` → Roster → open a practice → try
   Desactivar/Reactivar, Restablecer contraseña, and Iniciar sesión como… → Analytics → Estado del
   sistema.
