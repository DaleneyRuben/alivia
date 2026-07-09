# Medical History ships in v1, as an opt-in feature

Every other non-core idea raised this session (in-app payments, WhatsApp Business API, reviews, native app, public self-serve signup) was pushed to a later version to keep v1 to the booking loop. Medical History breaks that pattern: it's a genuinely different kind of data (clinical, not scheduling) and a bigger build than anything else in scope.

It's included anyway because it's a real differentiator for the doctors we're recruiting first — a reason to prefer this platform over a plain booking tool — and it reuses the Appointment/Attended lifecycle we're already building rather than requiring a parallel system. To keep the core loop unaffected, it's opt-in per Doctor: a Doctor who doesn't want it never sees it, and the booking flow works identically with or without it.
