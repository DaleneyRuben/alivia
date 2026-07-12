# Flujos — Flow diagrams

Flow diagrams for Alivia, produced **before** any schema or code work so the whole
system is agreed on paper first. They are grounded in `CONTEXT.md` (the ubiquitous
language), the ADRs under `docs/adr/`, and the two design prototypes under `design/`.

## What's here

| Doc | Covers |
|---|---|
| [`patient-site.md`](patient-site.md) | Public patient site (no login): search → profile → booking → confirmation → cancel, plus availability ranking and Slot states. |
| [`doctor-secretary-panel.md`](doctor-secretary-panel.md) | Login, onboarding, and every panel screen. Doctor vs Secretary navigation. |
| [`admin.md`](admin.md) | Founder-only Admin: roster, create practice, practice detail + impersonation, analytics, system status. |
| [`domain-lifecycles.md`](domain-lifecycles.md) | Domain state machines that cut across screens: Appointment, Slot/availability, account provisioning → onboarding, Medical History. |

The first three are **UI navigation flows** (screen to screen). The last is the
**domain lifecycles** (state machines for the underlying entities).

## Conventions

- **Format**: [Mermaid](https://mermaid.js.org/) fenced code blocks — they render
  directly on GitHub and diff as text.
- **Labels**: English domain terms are the backbone (matching `CONTEXT.md` and the
  code identifiers), with the real Spanish screen/label in parentheses when a node
  names an actual screen or control — e.g. `Appointments (Citas)`. Domain terms kept
  in Spanish by `CONTEXT.md` (e.g. *diagnóstico*) stay Spanish.
- **Edges**: solid arrows are forward actions; **dotted** arrows are back/secondary
  navigation.
- **Terminal states** in state diagrams end at `[*]`.
- These describe the **product**, not the prototype scaffolding. The prototypes'
  Paciente/Doctor and Panel/Admin toggles are demo conveniences — in production the
  patient site is public and the panel/admin are behind separate logins. Where the
  prototype simplifies real behavior (e.g. always routing a Doctor to Onboarding),
  the diagram models the intended product rule and notes the difference.

## Sources

- Domain language: [`../../CONTEXT.md`](../../CONTEXT.md)
- Decisions: [`../adr/`](../adr/) (referenced inline where relevant)
- Design intent: [`../../design/README.md`](../../design/README.md) and the two
  `design/*.dc.html` prototypes
