# Doctor/Assistant panel — flows

The login-gated surface shared by Doctors and their Assistants. Both roles use the
same shell, but a **Assistant has a structurally shorter navigation** and cannot reach
Locations, the Doctor's Account/Subscription, or Medical History
(`CONTEXT.md`: Assistant). Accounts are founder-provisioned
([ADR-0005](../adr/0005-concierge-doctor-onboarding.md),
[ADR-0013](../adr/0013-assistant-accounts-founder-provisioned.md)).

## 1. Login & role-based routing

No self-serve password reset — resets are administrator-driven (`CONTEXT.md`: Admin;
see [`admin.md`](admin.md) flow 3).

```mermaid
flowchart TD
    Login["Login (Ingresar)"] --> Sub{"email + password submitted"}
    Sub -->|"invalid"| Err["Error banner: Correo o contraseña incorrectos"]
    Err --> Login
    Sub -->|"valid"| Who{"Which account?"}
    Who -->|"Doctor, first login"| Onb["Onboarding wizard"]
    Who -->|"Doctor, returning"| Appt["Appointments (Citas)"]
    Who -->|"Assistant"| Appt
    Login -.->|"¿Olvidaste tu contraseña?"| Note["No self-serve reset — contacta a tu administrador"]
```

> The prototype always routes a Doctor to Onboarding for demo purposes; the product
> rule is **first login only**, then straight to Appointments on return.

## 2. Onboarding wizard (Doctor only, first login)

An Assistant never sees this. The Doctor fills in everything themselves — the concierge
step only created a bare, name-only account
([ADR-0005](../adr/0005-concierge-doctor-onboarding.md)).

```mermaid
flowchart LR
    S1["1 · Profile (Perfil)"] --> S2["2 · Locations (Ubicaciones)"]
    S2 --> S3["3 · Schedule blocks (Bloques de horario)"]
    S3 --> S4["4 · Review (Revisar)"]
    S4 -->|"Entrar al panel"| Appt["Appointments (Citas)"]
    S2 -.->|"← Atrás"| S1
    S3 -.->|"← Atrás"| S2
    S4 -.->|"← Atrás"| S3
```

- **Step 2** — add one or more Locations (name + address).
- **Step 3** — per-Location tabs; each Schedule block sets day range, time range, **Slot
  duration**, and **Slot capacity**; multiple blocks per Location
  ([ADR-0004](../adr/0004-schedule-per-location.md),
  [ADR-0009](../adr/0009-slots-have-capacity.md)).
- **Back** is hidden on step 1. Everything is editable later from the panel.

## 3. Navigation shell — Doctor vs Assistant

The doctor-only items are **absent from the DOM** for an Assistant (with matching route
guards), not merely disabled.

```mermaid
flowchart TD
    subgraph doctor["Doctor nav"]
        D1["Citas"]
        D2["Confirmaciones (badge = pending count)"]
        D3["Horarios"]
        D4["Vacaciones"]
        D5["Ubicaciones"]
        D6["Historial"]
        D7["Cuenta"]
    end
    subgraph assistant["Assistant nav — Ubicaciones / Historial / Cuenta absent"]
        E1["Citas"]
        E2["Confirmaciones (badge = pending count)"]
        E3["Horarios"]
        E4["Vacaciones"]
    end
```

> Guard: if the session becomes an Assistant while on a doctor-only screen, it redirects
> to Appointments.

## 4. Appointments / queue (Citas)

Filterable by Day and Location. Staff can enter Appointments for patients who booked
off-platform, including **over a Slot's patient-facing capacity** as a deliberate
override ([ADR-0009](../adr/0009-slots-have-capacity.md)). Available to Doctor **and**
Assistant — an Assistant may mark attendance (`CONTEXT.md`: Assistant).

```mermaid
flowchart TD
    A["Appointments (Citas)"] --> Filt["Filter by Day (Hoy / Mañana) + Location switcher"]
    Filt --> List["Queue rows for that Day + Location"]
    A -->|"+ Agregar cita"| Form["Manual add: patient name, phone, pick a Slot"]
    Form --> Cap{"Chosen Slot at capacity?"}
    Cap -->|"yes"| Over["Amber notice: over-capacity staff override — patient joins the queue"]
    Cap -->|"no"| Ok[" "]
    Over --> Save["Agregar a la cola → appends Appointment (pending, 'Walk-in' tag)"]
    Ok --> Save
    Save --> List
    List --> Row{"Per-row action while pending"}
    Row -->|"Cancelar (always available)"| Can["status → Cancelled (frees the Slot)"]
    Row -->|"once scheduled time has passed"| Passed{"Asistió / No asistió"}
    Passed -->|"Asistió"| Att["status → Attended"]
    Passed -->|"No asistió"| Ns["status → No-show"]
    Att --> Nxt["'Siguiente' marker advances to next pending row (same day)"]
    Ns --> Nxt
```

> Marking **Attended** is also the trigger for a Medical History Diagnosis Entry — but
> only when the **Doctor** does it and has opted in (see flow 9 and the Appointment
> lifecycle in [`domain-lifecycles.md`](domain-lifecycles.md)).

## 5. Day-before Confirmations (Confirmaciones)

Manual WhatsApp, never automated ([ADR-0003](../adr/0003-whatsapp-via-manual-links.md)).
The pending count drives the nav badge.

```mermaid
flowchart TD
    C["Confirmations (Confirmaciones) — tomorrow's Appointments"] --> Row["Per pending row"]
    Row -->|"✆ WhatsApp"| Wa["Opens pre-filled wa.me — staff taps send manually"]
    Row -->|"Confirmó"| Cf["status → Confirmed (intent to attend)"]
    Row -->|"Canceló"| Cx["status → Cancelled — frees the Slot"]
    Wa -.->|"outcome is marked by hand (no delivery auto-detect)"| Row
    Cf --> Badge["Pending count feeds the Confirmaciones nav badge"]
    Cx --> Badge
```

## 6. Schedule editor (Horarios)

Blocks are **per Location** ([ADR-0004](../adr/0004-schedule-per-location.md)).

```mermaid
flowchart TD
    H["Schedule (Horarios)"] --> Loc["Location switcher (if more than one)"]
    Loc --> Blocks["Blocks for that Location: days, time range, Slot duration, capacity"]
    Blocks -->|"Editar"| Edit["Edit block"]
    Blocks -->|"Quitar"| Rem["Remove block"]
    Blocks -->|"+ Agregar bloque"| Add["Add block (day/time range, duration, capacity)"]
```

## 7. Vacation editor (Vacaciones)

Marks a date range unavailable so no Slots are shown for it (`CONTEXT.md`: Vacation).
Scoped to one Location, or the whole practice at once (`locationId` nullable — null
means every Location).

```mermaid
flowchart TD
    V["Vacation (Vacaciones)"] --> F["Ubicación (Todas las ubicaciones / one Location) + Desde / Hasta → Agregar"]
    F --> L["Upcoming vacation periods list — each row shows its Location scope"]
    L -->|"Quitar (before it starts)"| R["Remove period"]
```

## 8. Locations management (Doctor only)

The only screen where **removing** a Location matters, because it has Schedules tied to
it ([ADR-0004](../adr/0004-schedule-per-location.md)).

```mermaid
flowchart TD
    Lo["Locations (Ubicaciones) — Doctor only"] --> ListL["List: name, address, number of Schedule blocks"]
    ListL -->|"+ Nueva ubicación"| New["Add Location"]
    ListL -->|"Editar"| Ed["Edit Location"]
    ListL -->|"Quitar"| Chk{"Has Schedule blocks?"}
    Chk -->|"yes"| Warn["Warn: its blocks are deleted and future availability stops"]
    Chk -->|"no"| Del["Remove"]
    Warn -->|"confirm"| Del
```

## 9. Medical History (Doctor only, opt-in, append-only)

Ships in v1 but opt-in ([ADR-0010](../adr/0010-medical-history-optional-in-v1.md)),
siloed per Doctor–Patient pair
([ADR-0011](../adr/0011-medical-history-siloed-per-doctor.md)). Entries can be edited but
**never deleted** — history only grows.

```mermaid
flowchart TD
    M["Medical History (Historia clínica) — Doctor only"] --> En{"Feature enabled for this Doctor?"}
    En -->|"no"| Opt["Opt-in empty state → 'Activar historia clínica'"]
    Opt --> PList
    En -->|"yes"| PList["Patient list (tags: Con historia / Nueva)"]
    PList -->|"open a Patient"| Has{"Patient has history yet?"}
    Has -->|"no (first visit)"| FForm["Combined 'PRIMERA VISITA' form: Medical Profile + first Diagnosis Entry"]
    FForm -->|"Guardar historia clínica"| Detail["Patient detail: Perfil base + reverse-chron timeline"]
    Has -->|"yes"| Detail
    Detail -->|"+ Nueva nota"| AddE["Append a Diagnosis Entry"]
    Detail -->|"Editar"| EditE["Edit an existing entry (no delete anywhere)"]
    AddE --> Detail
```

> The Medical Profile + first Diagnosis Entry are captured together the first time a
> Patient's Appointment is marked **Attended** (`CONTEXT.md`: Medical Profile). A
> Assistant can mark Attended but can never view or edit this screen.

## 10. Account settings (Doctor only)

```mermaid
flowchart TD
    Ac["Account (Cuenta / Ajustes) — Doctor only"] --> P["Profile (editable) → Guardar cambios"]
    Ac --> Sub["Subscription (view-only): Activa + renewal date; payment handled outside the app"]
    Ac --> Sec["Assistants (view-only list) — founder-provisioned, no invite here"]
```

Subscription is record-keeping only, no in-app billing
([ADR-0002](../adr/0002-no-in-app-payments.md)); Assistants are created by the founder,
not invited here ([ADR-0013](../adr/0013-assistant-accounts-founder-provisioned.md)).

---

**Sources**: `CONTEXT.md` (Doctor, Assistant, Onboarding, Schedule, Slot, Vacation,
Appointment, Confirmation, Medical History, Subscription); ADRs
[0002](../adr/0002-no-in-app-payments.md),
[0003](../adr/0003-whatsapp-via-manual-links.md),
[0004](../adr/0004-schedule-per-location.md),
[0005](../adr/0005-concierge-doctor-onboarding.md),
[0009](../adr/0009-slots-have-capacity.md),
[0010](../adr/0010-medical-history-optional-in-v1.md),
[0011](../adr/0011-medical-history-siloed-per-doctor.md),
[0013](../adr/0013-assistant-accounts-founder-provisioned.md); prototype
`design/Alivia Panel Prototype.dc.html`.
