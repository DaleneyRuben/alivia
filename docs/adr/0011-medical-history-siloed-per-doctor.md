# Medical History is siloed per Doctor-Patient pair, not shared platform-wide

A Patient can book with multiple Doctors on the platform, potentially across unrelated specialties. Medical History could have been modeled as one shared record per Patient, visible to every Doctor they see — closer to a real EHR.

Instead, each Doctor keeps a fully separate Medical History for a Patient, invisible to any other Doctor. There's no consent or authorization flow in this app for a Patient to approve sharing clinical data between the Doctors they see, so a shared record would leak diagnóstico across relationships the Patient never agreed to connect. Siloed-per-Doctor also matches how Doctors described the feature: "their list of patients," not a platform-wide chart. The cost is minor duplication — a Patient re-answers baseline info (blood type, etc.) for each Doctor — which is acceptable.

This is hard to reverse later: merging siloed histories into a shared record (or vice versa) after real clinical data exists would need patient consent for anything not fully manual.
