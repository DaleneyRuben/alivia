# Slots have configurable capacity, not one Appointment each

Most booking tools (Calendly and similar) assume one Appointment claims a time slot exclusively. That's not how doctors in La Paz practice: patients are commonly block-booked into the same nominal time (e.g. everyone told "1:00-2:00") and seen in a queue at the office. Modeling Slots as exclusive would misrepresent this and force a workaround later.

Instead, a Schedule block (per Location) is configured with a Slot duration and a capacity — the number of Appointments that can be booked into each generated Slot before it disappears from availability. Duration and capacity can vary block to block, so a Doctor can run a tighter queue in the morning than the afternoon, or differently across Locations. The system doesn't manage queue order within a Slot — that happens in person at the office.
