## Verifying Alivia end-to-end

**Launch:** `yarn dev` (Next.js/Turbopack, port 3000). Local Postgres must already be
running (`DATABASE_URL` in `.env` points at `alivia_dev`) — check with
`pg_isready -h localhost -p 5432`. The dev DB is pre-seeded (`yarn db:seed` if empty).

**Dev accounts** (password for all: `alivia123`):

- `admin@alivia.bo` — Admin
- `doctor@alivia.bo` — Doctor (Dra. Valeria Rojas, Pediatría, onboarded, "Consultorio Zabala")
- `asistente@alivia.bo` — Assistant, linked to the same practice

**Key routes:** `/` (patient home/search) → `/doctors/[id]` (profile, slot picker) →
`/booking` (guest form) → `/confirmation/[token]`. `/login` (shared login for
Doctor/Assistant/Admin). Panel lives at `/panel/appointments` (Citas), etc. Admin
roster at `/admin`, create-practice form at `/admin/create` (not `/admin/create-practice`).

**Playwright gotchas:**

- Doctor profile slot buttons are `<Link>` elements, not `<button>` — use
  `page.getByRole("link").filter({ hasText: /^\d{1,2}:\d{2}/ })`, not `getByRole("button")`.
- Login form labels: `"Correo electrónico"` / `"Contraseña"`, submit button `"Ingresar"`.
- Switching accounts (e.g. Assistant → Admin) in the same Playwright page: call
  `page.context().clearCookies()` before navigating to `/login` again, otherwise the
  existing session just redirects past the login form and label lookups time out.
- Shared `PhoneInput` (`src/components/ui/PhoneInput.tsx`): the country `<select>` has
  `aria-label="Código de país"`, not a visible label — use `getByLabel("Código de país")`
  or `page.locator("select[aria-label='Código de país']")` when there are multiple on one
  page (e.g. Crear consultorio has one per doctor/assistant phone field, use `.nth(n)`).

**Worth driving for a UI change:** patient booking flow (search → profile → slot →
booking form → confirmation), the panel walk-in "+ Agregar cita" form, and the admin
"Crear consultorio" form — these three plus the login form cover most shared components.
