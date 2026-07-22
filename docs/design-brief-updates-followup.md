# Alivia — design prompt, round 3 follow-up (country list fix)

Paste everything below into the same Claude.ai conversation used for the round-3 updates (or a new
one — this is a small, self-contained fix and doesn't depend on that conversation's history).

---

## One small fix to a change you already made

In the last round, a country-code dropdown (flag + dial code, e.g. 🇧🇴 +591) was added to every
phone-number input across Alivia's design files — the patient Booking screen, the panel's
"+ Agregar cita" walk-in form, and both the doctor and secretary phone fields on the Crear consulta
screen. That part is correct and should **stay exactly as it is**: same four locations, same
Bolivia-preselected default, same shared/consistent component.

**The one thing to fix:** the list backing that dropdown currently only has ~27 countries (Bolivia,
the rest of Latin America, and a handful of major markets like the US, Spain, France, China, etc.).
It needs to be the **full global list** — every country, with its flag and dial code — not a curated
subset. Bolivia (🇧🇴 +591) should still be the default/preselected entry everywhere, same as now.

This list lives in a `countries()` method reused by both `Alivia Prototype.dc.html` and
`Alivia Panel Prototype.dc.html` (each file has its own copy of the same array) — update it in both
places so the two prototypes stay in sync with each other, and update the design README's write-up
of this control if it currently says "full global list" already (it should end up actually being
true, not just stated).

Nothing else about this round's other five changes (the logout dropdown, removing "Ingresar", the
doctor-profile updates, the Horarios overlap validation, or the result-card click behavior) needs
touching — this prompt is scoped to the country list only.
