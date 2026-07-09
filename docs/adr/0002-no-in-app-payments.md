# No in-app payments for v1

Doctors pay a monthly Subscription and patients pay for their consultation as normal (cash/QR at the office) — neither flows through the app in v1. Payment processing in Bolivia is fragmented (no Stripe-equivalent with broad reach) and building it would mean handling refunds, failed payments, and reconciliation before the core booking loop is even validated. Both payments are tracked manually outside the app; this can be revisited once there's a proven base of subscribing doctors.
