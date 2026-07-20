# Credential delivery via WhatsApp, not email

**Supersedes [0015](0015-credentials-via-email-setup-link.md).**

The account setup link (first login after concierge provisioning, [0005](0005-concierge-doctor-onboarding.md)/[0013](0013-assistant-accounts-founder-provisioned.md)) and admin-driven password resets are delivered over WhatsApp instead of email. Email adoption is low among doctors and assistants in La Paz relative to WhatsApp, which is already the platform's channel for every other time-sensitive message to a human ([0003](0003-whatsapp-via-manual-links.md)) — an emailed link risks going unread, the same problem 0003 solved for patient-facing messages.

This reuses 0003's existing pattern rather than inventing a new one: the system builds the setup/reset URL and a pre-filled `wa.me` link around it, and the founder taps to send it manually from the Admin practice detail screen — no WhatsApp Business API, no per-message cost, no Meta business verification. The underlying credential mechanism from 0015 is unchanged: `User.passwordHash` stays nullable until the link is used, and there's a single active `resetToken`/`resetTokenExpires` per account, reused for both first-time setup and resets.

**Consequence**: Doctor and Assistant accounts need a phone number captured at creation (Admin's Create practice flow) in addition to email — email remains the login identifier/username, unrelated to delivery now. This removes transactional email infrastructure from the v1 stack entirely; the "WhatsApp link generation" health check already listed in Admin's System status ([admin flow §5](../flows/admin.md)) covers this too.

**Alternatives rejected**: keep the emailed link (the problem this ADR fixes — low open rates in this market); automate sending via the WhatsApp Business API (cost and business-verification overhead, rejected in 0003 for the same reason, and credential links are low enough volume that manual sending is no burden).
