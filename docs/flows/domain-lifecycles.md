# Domain lifecycles — state machines

The state machines behind the entities, independent of any single screen. These are the
rules the schema and server logic must enforce; the UI flows in the other docs are ways
of driving these transitions.

## 1. Appointment lifecycle

An Appointment is created either by a Patient self-booking (guest) or entered by
staff for an off-platform patient — the latter may exceed a Slot's patient-facing
capacity ([ADR-0009](../adr/0009-slots-have-capacity.md)). The day-before **Confirmation**
checks *intent to attend* and is distinct from the final **Attended / No-show** outcome
recorded after the appointment time (`CONTEXT.md`: Appointment, Confirmation).

```mermaid
stateDiagram-v2
    [*] --> Scheduled: created — Patient self-books (guest) OR staff enters manually

    state Scheduled {
        [*] --> Unconfirmed
        Unconfirmed --> Confirmed: day-before Confirmation (manual WhatsApp)
    }

    Scheduled --> Cancelled: patient cancel link · staff cancel · patient can't attend (during Confirmation)
    Scheduled --> Attended: after the time — staff marks Attended
    Scheduled --> NoShow: after the time — staff marks No-show

    Attended --> [*]
    NoShow --> [*]
    Cancelled --> [*]

    note right of Cancelled
        Cancelling frees the Slot for other patients.
    end note
    note right of Attended
        If the Doctor has opted into Medical History,
        marking Attended records a Diagnosis Entry
        (the first Attended visit also creates the Medical Profile).
        An Assistant may mark Attended but never sees or records history.
    end note
```

- **Confirmation** (Confirmed / Unconfirmed) is a sub-state of Scheduled, not a terminal
  state — it only reflects the day-before check
  ([ADR-0003](../adr/0003-whatsapp-via-manual-links.md)).
- **Attended, No-show, Cancelled** are final.

## 2. Slot capacity & availability

A Slot is generated from a Schedule block (per Location) and its duration/capacity
([ADR-0004](../adr/0004-schedule-per-location.md),
[ADR-0009](../adr/0009-slots-have-capacity.md)). Capacity is a **hard cap for patient
self-booking only** — staff can override.

```mermaid
stateDiagram-v2
    state "Open — shown to patients" as Open
    state "At capacity — hidden from patient self-booking" as AtCapacity

    [*] --> Generated: Schedule block × Slot duration × capacity
    Generated --> Open
    Open --> Open: Appointment added / cancelled while below capacity
    Open --> AtCapacity: booked Appointments reach capacity
    AtCapacity --> Open: an Appointment is cancelled (a spot frees)

    note right of AtCapacity
        Only hidden from patient search/self-booking.
        Staff can still add an Appointment as an over-capacity override.
    end note
    note left of Generated
        During a Vacation period, no Slots are shown to patients
        for the affected Doctor / Location.
    end note
```

## 3. Account provisioning → onboarding

Concierge account creation, then self-serve setup
([ADR-0005](../adr/0005-concierge-doctor-onboarding.md),
[ADR-0013](../adr/0013-assistant-accounts-founder-provisioned.md)). There is no public
doctor signup in v1.

```mermaid
flowchart TD
    F["Founder creates bare accounts in Admin"] --> DAcc["Doctor account (name only)"]
    F --> SAcc["Assistant account (optional)"]
    DAcc --> DLogin["Doctor first login"]
    DLogin --> Onb["Onboarding wizard: Profile, Locations, Schedule blocks"]
    Onb --> Active["Active practice — Doctor appears in patient search"]
    SAcc --> SLogin["Assistant login → Panel (no onboarding)"]
    Active -.->|"Admin, any time later"| Ops["Deactivate · reset password · impersonate"]
```

## 4. Medical History (per Doctor–Patient pair)

Opt-in per Doctor ([ADR-0010](../adr/0010-medical-history-optional-in-v1.md)), siloed per
Doctor–Patient pair ([ADR-0011](../adr/0011-medical-history-siloed-per-doctor.md)),
append-only. The Medical Profile and first Diagnosis Entry are created together on the
first Attended visit (`CONTEXT.md`: Medical Profile, Diagnosis Entry).

```mermaid
stateDiagram-v2
    [*] --> NotEnabled: Doctor has not opted in
    NotEnabled --> Enabled: Doctor activates Medical History

    Enabled --> NoHistory: for a given Patient — no record yet
    NoHistory --> HasHistory: first Appointment marked Attended → create Medical Profile + first Diagnosis Entry
    HasHistory --> HasHistory: subsequent Attended visit → append a Diagnosis Entry (editable, never deletable)

    note right of HasHistory
        Siloed per Doctor–Patient pair: invisible to other Doctors and to
        Assistants. The only exception is founder Admin impersonation (ADR-0014).
    end note
```

---

**Sources**: `CONTEXT.md` (Slot, Appointment, Confirmation, Vacation, Onboarding,
Medical History, Medical Profile, Diagnosis Entry, Assistant, Admin); ADRs
[0003](../adr/0003-whatsapp-via-manual-links.md),
[0004](../adr/0004-schedule-per-location.md),
[0005](../adr/0005-concierge-doctor-onboarding.md),
[0009](../adr/0009-slots-have-capacity.md),
[0010](../adr/0010-medical-history-optional-in-v1.md),
[0011](../adr/0011-medical-history-siloed-per-doctor.md),
[0013](../adr/0013-assistant-accounts-founder-provisioned.md),
[0014](../adr/0014-admin-impersonation-full-access.md).
