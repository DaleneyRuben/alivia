# Patient site — flows

The public, no-login surface. A Patient books as a guest: identified by name + phone,
never an account ([ADR-0006](../adr/0006-guest-booking-no-patient-accounts.md)). The
core differentiator is that doctors are ranked by **soonest available Slot**, not by
proximity ([ADR-0008](../adr/0008-availability-first-search-no-location-filter.md)).

## 1. Booking loop (screen navigation)

```mermaid
flowchart TD
    Home["Home / Search (Inicio)"]
    Results["Results (Resultados)"]
    Profile["Doctor profile (Perfil del doctor)"]
    Booking["Booking (Confirma tu cita)"]
    Confirm["Confirmation (¡Tu cita está reservada!)"]
    Cancel["Cancel page (¿Cancelar tu cita?)"]
    Cancelled(["Cancelled (Cita cancelada)"])
    WA{{"WhatsApp self-send — wa.me, external"}}
    Empty["Empty state: no especialistas"]
    Panel["Panel login (Ingresar)"]

    Home -->|"submit search / specialty chip"| Results
    Home -->|"click a featured doctor card / Reservar"| Profile
    Home -.->|"Ingresar (top bar)"| Panel
    Results -->|"click card / Reservar"| Profile
    Results -.->|"no matches"| Empty
    Profile -->|"pick an available Slot"| Booking
    Booking -->|"name + phone valid → Confirmar reserva"| Confirm
    Confirm -->|"Enviarme la confirmación"| WA
    Confirm -->|"Cancelar esta cita"| Cancel
    Cancel -->|"Sí, cancelar cita"| Cancelled
    Cancel -->|"Mantener mi cita"| Confirm
    Cancelled -->|"Buscar otro horario"| Home

    Results -.->|"← Volver a inicio"| Home
    Profile -.->|"← Volver a resultados"| Results
    Booking -.->|"← Cambiar horario"| Profile
```

**Notes**

- The Home page lists the top-3 doctors by availability. Clicking a featured card (or
  its **Reservar**) jumps straight to that Doctor's profile, skipping Results.
- In production the **Cancel page is reached from the cancel link inside the Patient's
  WhatsApp confirmation message** — no login needed. The "Cancelar esta cita" button on
  the Confirmation screen is the prototype's shortcut to that same page.
- The home has two visual variants (identity-first `1a`, time-block-first `1b`); they
  differ only in presentation, not navigation.

## 2. Search & availability ranking

Patients search by specialty only — no location/zone filter
([ADR-0008](../adr/0008-availability-first-search-no-location-filter.md)).

```mermaid
flowchart TD
    Q["Query = specialty chip OR typed text"] --> F["Filter doctors: case-insensitive substring match on specialty OR doctor name"]
    F --> S["Sort ascending by availability rank (today's Slots before tomorrow's)"]
    S --> R{"Any matches?"}
    R -->|"yes"| List["Ranked result cards, each with a 'próxima cita' pill: green dot = today, sand = later"]
    R -->|"no"| E["Empty state: no encontramos especialistas"]
```

## 3. Slot selection (state of a Slot button on the profile)

A Patient sees only whether a time is **open or closed** — the Slot's queue capacity is
hidden ([ADR-0009](../adr/0009-slots-have-capacity.md)). A "taken" Slot is one that has
reached capacity for patient self-booking.

```mermaid
stateDiagram-v2
    [*] --> Available
    Available --> SoonestAvailable: is the earliest open Slot (highlighted)
    Available --> Selected: patient taps
    SoonestAvailable --> Selected: patient taps
    Selected --> [*]: advances to Booking
    Taken --> Taken: disabled — at capacity, shown struck-through
    note right of Taken
        Capacity is a hard cap for patient self-booking only.
        Staff can still add over capacity (see the panel flows).
    end note
```

## 4. Booking form validation

```mermaid
flowchart TD
    In["Name + phone inputs (guest — no account)"] --> V{"name length > 1 AND phone length >= 6 ?"}
    V -->|"no"| Dis["'Confirmar reserva' disabled"]
    V -->|"yes"| En["'Confirmar reserva' enabled"]
    En -->|"submit"| C["Creates the Appointment → Confirmation screen"]
```

---

**Sources**: `CONTEXT.md` (Patient, Slot, Appointment, Confirmation),
[ADR-0006](../adr/0006-guest-booking-no-patient-accounts.md),
[ADR-0008](../adr/0008-availability-first-search-no-location-filter.md),
[ADR-0009](../adr/0009-slots-have-capacity.md),
[ADR-0003](../adr/0003-whatsapp-via-manual-links.md); prototype `design/Alivia Prototype.dc.html`.
