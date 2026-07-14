# Appointments

A booking platform for solo and small-practice doctors in La Paz, Bolivia. Patients search for a doctor and book an open slot; doctors (and their assistants) manage availability, walk-in patients, and day-before confirmations.

## Language

**Doctor**:
A medical professional (any specialty) who offers appointments through the platform. The paying customer — pays a monthly subscription, handled outside the app.
_Avoid_: Provider, Business (earlier, more generic terms from before the vertical was narrowed to doctors specifically)

**Onboarding**:
The in-app setup flow a Doctor completes the first time they get access — filling in their profile, Locations, and Schedule blocks (with Slot duration and capacity) themselves. Follows account creation, which is concierge (the founder grants access to a bare, name-only account) rather than a public signup form.

**Location**:
A physical place where a Doctor holds consultations (a consultorio, clinic office, or hospital wing). A Doctor may have several; each has its own weekly Schedule. An Appointment is always tied to a Doctor at a specific Location, not just a Doctor. Not used as a patient-facing search filter — search ranks by availability, not proximity. Surfaced at the moment a patient picks a time slot: since a Doctor's slots can belong to different Locations on different days, selecting a slot (e.g. 1:00-2:00) shows which Location that specific slot is at.
_Avoid_: Clinic (implies a specific kind of facility; a Location can be any of several)

**Schedule**:
The recurring weekly availability a Doctor has at one Location (which days, which hours). Distinct per Location — a Doctor with two Locations has two Schedules. Made up of one or more blocks (e.g. "Mon-Fri 8:00-12:00"), each configured with its own Slot duration and capacity — these can vary block to block, so a Doctor can run a tighter queue in the morning than the afternoon, or differently across Locations.

**Slot**:
A bookable block of time generated from a Schedule block (e.g. 1:00-1:30), with a capacity — the maximum number of Appointments that can be booked into it. Reflects how doctors in La Paz commonly see several patients within the same nominal time block, seen in a queue at the office, rather than one patient per exact time. A Slot stays available until Appointments booked into it reach its capacity — but capacity is a hard cap only for patient self-booking. A Doctor/Assistant can manually add an Appointment past capacity (e.g. a regular patient calling directly), since staff already know what the doctor's queue can really absorb.
_Avoid_: Time slot as a synonym for Appointment — a Slot can hold several Appointments at once.

**Vacation**:
A period during which a Doctor (or one of their Locations) is marked unavailable, so no slots are shown to patients for that time. Set by the Doctor or Assistant.

**Appointment**:
A Patient's booking into a Slot — inherits the Doctor, Location, and time from that Slot. Created either by a Patient through self-service booking, or entered directly by the Doctor/Assistant for patients who booked outside the platform (e.g. by phone). Can be cancelled two ways: the Patient taps a cancel link included in their booking confirmation (no account needed), or the Doctor/Assistant marks it cancelled in the panel after the patient calls or messages directly, including during the day-before Confirmation call. After the Appointment's time has passed, the Doctor/Assistant marks it Attended or No-show — this is the final state, distinct from Confirmation (which only checks intent to attend, the day before).
_Avoid_: Booking, Cita (Spanish equivalent, keep English term canonical in code/docs)

**Patient**:
A person an Appointment is for. Has no login or account — identified by name and phone number. A lightweight Patient record (contact info, appointment history) is still stored, whether they booked themselves (guest booking) or were entered by an Assistant.
_Avoid_: User, Client, Account holder

**Medical History**:
A Doctor's optional, opt-in record of their clinical relationship with one Patient — a Medical Profile plus a growing list of Diagnosis Entries. Scoped to a single Doctor-Patient pair: if a Patient sees two different Doctors on the platform, each Doctor keeps their own separate Medical History for that Patient, with no sharing between them. Doctor-only — an Assistant can never view or edit it, even though an Assistant can mark the underlying Appointments Attended. A Doctor who hasn't enabled this feature has no Medical History for any Patient.
_Avoid_: Historial Médico (Spanish equivalent, keep English term canonical in code/docs), EHR/health record (implies a shared, cross-provider record — this is deliberately siloed per Doctor)

**Medical Profile**:
The one-time baseline info (e.g. date of birth, blood type) a Doctor records for a Patient, captured the first time that Patient's Appointment with this Doctor is marked Attended. Created once per Doctor-Patient pair, alongside that visit's first Diagnosis Entry.

**Diagnosis Entry**:
A record of a single visit's diagnóstico and treatment, added to a Patient's Medical History each time the Doctor marks that Patient's Appointment Attended. The Doctor can review every prior Diagnosis Entry for a Patient at each subsequent visit. A Doctor can edit an entry later (e.g. to fix a mistake), but not delete one — Medical History only grows.

**Assistant**:
A role, distinct from the Doctor, that can manage the Doctor's Schedule, Vacation, and Appointments on their behalf — including entering Appointments for patients who called or walked in outside the platform, and confirming tomorrow's Appointments with patients. Linked to exactly one Doctor — not shared across multiple Doctors, even at a shared office. Can manage day-to-day operations (Schedule within existing Locations, Vacation, Appointments, Confirmations) but not sensitive/structural changes — adding or removing Locations, editing the Doctor's profile, anything account/Subscription-level, or a Patient's Medical History stays Doctor-only.
Created by the founder via the Admin view, the same concierge pattern as the Doctor account itself (see [0005](docs/adr/0005-concierge-doctor-onboarding.md)) — not self-serve invited by the Doctor. The founder typically provisions both accounts together when onboarding a practice (e.g. "Consultorio Zabala" gets a Doctor login and an Assistant login at the same time).

**Admin**:
The founder's own view of the platform, distinct from the Doctor/Assistant panel — a roster of every onboarded practice (Doctor + optional Assistant account) used to provision new accounts and see who's on the platform. Not a role a Doctor or Assistant ever has access to. Beyond provisioning, the founder can deactivate a practice's accounts, reset a Doctor/Assistant's password, and impersonate a Doctor or Assistant (log in as them, e.g. to help with a support request). Also surfaces platform health: business metrics (practices onboarded, Appointments booked) and technical status (database, deployment).

**Confirmation**:
The day-before check where the Doctor or Assistant contacts a Patient (via WhatsApp) to verify an Appointment will be attended. Tracked per Appointment; not automated in v1 — a human sends the message. If the patient can't make it, the Assistant cancels the Appointment during this call, freeing the slot for other patients.

**Subscription**:
The Doctor's recurring monthly payment to the platform for access. Tracked in the platform for record-keeping, but the payment itself happens outside the app (no in-app billing in v1).
