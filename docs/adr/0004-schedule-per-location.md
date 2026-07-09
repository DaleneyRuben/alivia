# Availability is modeled per Location, not per Doctor

Doctors in La Paz commonly split their week across multiple physical Locations (e.g. a public hospital shift and a private consultorio, or two different clinics). Modeling a Doctor as having a single weekly availability grid would misrepresent this and require a costly rework later. Instead, each Doctor has one or more Locations, each with its own Schedule, and every Appointment is tied to a Doctor + Location + time, not just Doctor + time.
