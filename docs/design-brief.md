# Alivia — design prompt

Paste everything below into a Claude.ai conversation to generate the visual design.

---

I'm building **Alivia**, a web app that lets patients in La Paz, Bolivia find a doctor and book an appointment, and lets doctors (and their secretaries) manage their schedule and patients. Design the UI for it.

## Tone

Warm and approachable — not clinical. This is a low-friction, reassuring experience, closer to a friendly neighborhood service than a hospital system. Soft colors, rounded shapes, human warmth over sterile precision. The name "Alivia" comes from *aliviar* (to relieve) — the feeling should match that.

## Language

All UI copy (labels, buttons, messages) is in **neutral Spanish** — no regional slang or localisms, since it needs to read naturally across Spanish-speaking users generally, not just La Paz idiom.

## Responsive requirement

Every screen across all three surfaces below must look great on **desktop, tablet, and phone** — this isn't optional for any of them, including the admin surface.

## Domain concepts you need to know

- **Doctor** — the paying customer, offers appointments through the platform.
- **Location** — a physical place a Doctor sees patients (a doctor can have several, each with its own weekly schedule).
- **Schedule** — a Doctor's recurring weekly availability at one Location, made of blocks (e.g. "Mon-Fri 8:00-12:00").
- **Slot** — a bookable chunk of time generated from a Schedule block (e.g. 1:00-1:30) that can hold *multiple* patients at once (a "queue" model, common in La Paz) — patients don't see this capacity detail, they just see a time is open or not.
- **Appointment** — a Patient's booking into a Slot.
- **Patient** — no account, no login; identified by name + phone number (guest booking).
- **Secretary** — manages a Doctor's day-to-day (Schedule, Vacation, Appointments, Confirmations) on their behalf, but can't touch Locations, the Doctor's profile, or Medical History.
- **Confirmation** — the day before an Appointment, the Doctor/Secretary sends the Patient a WhatsApp message (via a pre-filled `wa.me` link they tap and send manually) to confirm attendance.
- **Medical History** — an optional, Doctor-only clinical record per Patient (baseline profile + a growing list of visit entries), never shared with Secretaries or other Doctors.
- **Admin** — the founder's own view for onboarding practices; not something a Doctor or Secretary ever sees.

A deliberate differentiator versus competitors (Doctoralia, Doctorpolis, DoctorPlace): search ranks by **soonest available slot**, not by location/proximity — getting seen fast matters more than convenience of location here. Make "next available" a prominent, confident visual element wherever a Doctor is listed.

## Surface 1 — Public patient site (no login)

1. **Home / search** — specialty search (e.g. "cardiólogo"), results ranked by soonest open Slot. Each result: Doctor name, specialty, photo, next available time, at-a-glance credibility (not a star rating — reviews aren't part of this product).
2. **Doctor profile** — photo, name, specialty, short bio, list of Locations, and open Slots to pick from.
3. **Booking flow** — pick a Slot → enter name + phone (no account) → confirm.
4. **Booking confirmation** — Appointment summary (doctor, location, date/time) plus a clear call-to-action to send yourself the confirmation over WhatsApp, and a cancel link.
5. **Cancel-via-link page** — reached from the confirmation message, shows the Appointment and a one-tap cancel.

## Surface 2 — Doctor/Secretary panel (login required)

1. **Login**
2. **Onboarding wizard** (Doctor only, first login) — profile, add Locations, set up Schedule blocks (duration + capacity per block).
3. **Dashboard / today view** — today's queue at a glance.
4. **Appointments list/queue** — view by day/Location, add an Appointment manually (walk-in/phone patients), mark Attended / No-show, cancel.
5. **Day-before Confirmations view** — tomorrow's Appointments, a WhatsApp send button per Patient, mark confirmed/cancelled.
6. **Schedule editor** — weekly blocks per Location, each with its own Slot duration and capacity.
7. **Vacation editor** — mark a date range unavailable.
8. **Locations management** (Doctor only).
9. **Medical History** (Doctor only, opt-in feature) — per-Patient baseline profile plus a timeline of visit entries; can add a new entry, can edit but never delete past ones.
10. **Account settings** (Doctor only) — profile, Subscription status (view-only, no in-app payment), list of Secretaries.

## Surface 3 — Admin (founder only)

1. **Practice roster** — every onboarded practice (Doctor + optional Secretary), with status.
2. **Create practice** — provision a new Doctor account and, optionally, its Secretary account together.
3. **Practice detail** — deactivate the practice's accounts, reset a password, impersonate the Doctor or Secretary (log in as them for support — full access, including their Medical History).
4. **Analytics** — business metrics: practices onboarded over time, Appointments booked, etc.
5. **System status** — database and deployment health.

## What I want from you

Generate the visual design for these three surfaces — start with the public patient site since it's the core loop (search → profile → booking → confirmation), then the Doctor/Secretary panel, then Admin. Propose a color palette and type system that fits the warm/approachable tone, then apply it consistently across all three.
