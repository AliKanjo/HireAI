# HireAI — Security & Role-Based Access Control (RBAC) Architecture

## Overview
HireAI implements a defense-in-depth security model to enforce Role-Based Access Control (RBAC), protect user identity boundaries, and prevent unauthorized privilege escalation across Candidates, Recruiters, and Administrators.

---

## 1. Role-Based Access Control (RBAC) Matrix

| User Role | Dashboard Space | Permissions & Capabilities | Admin Provisioning |
| :--- | :--- | :--- | :--- |
| **Candidate** | `/candidate` | Browse jobs, submit CV applications, track application status, view match breakdowns, view scheduled interviews. Strictly blocked from recruiter AI tools. | Public Registration (`role: candidate`) |
| **Recruiter** | `/recruiter` | Post & manage job vacancies, trigger AI CV match analysis, rank applicants, generate LLM interview questions, schedule interviews, view recruitment analytics. | Public Registration (`role: recruiter`) |
| **Admin** | `/admin` | Access platform governance control plane, manage users & roles, toggle account statuses, monitor AI microservice telemetry & audit logs. | CLI-only Seeder (`AdminUserSeeder`) or Admin-gated promotion |

---

## 2. Security Threat Model & Defense-in-Depth

### A. Public Registration Role Escalation Protection
- **Vulnerability Prevented**: Mass-assignment privilege escalation via public API registration.
- **Enforcement Layer**:
  1. **Validation Layer (`AuthController.php`)**: Public `/api/auth/register` explicitly validates `role` using `'required|in:candidate,recruiter'`. Incoming requests attempting to register as `admin` fail with a `422 Unprocessable Entity` response.
  2. **Model Mass-Assignment Layer (`User.php`)**: `role` is excluded from the `$fillable` array. Models cannot mass-assign user roles via `$request->all()`.
  3. **CLI-Only Admin Provisioning (`AdminUserSeeder.php`)**: Initial Super Admin accounts are seeded strictly via Artisan CLI commands (`php artisan db:seed --class=AdminUserSeeder`). No public HTTP route can create an admin account.

### B. Route Protection Middleware (`CheckRole.php`)
- **Enforcement Layer**: All sensitive API endpoints are wrapped with `auth:sanctum` and `CheckRole` middleware.
- **DB Verification**: The middleware queries the authenticated database user record (`$request->user()->role`), ignoring client-controlled header parameters.
- **Response Codes**:
  - `401 Unauthenticated` if token is missing or invalid.
  - `403 Forbidden` if the user's database role does not match required route privileges.

### C. Admin Governance & Lockout Protection (`AdminUserController.php`)
- **Self-Demotion Guard**: An active admin cannot demote their own account role.
- **Last-Admin Lockout Guard**: The system checks `User::where('role', 'admin')->count()` and blocks demotion if only one admin account remains.
- **Self-Deactivation Guard**: Admins cannot deactivate their own active account status.

### D. Audit Telemetry & Rate Limiting
- **Audit Logging**: Role promotions and account status toggles are logged to the system audit stream with initiator ID, target ID, old/new roles, and ISO timestamps.
- **Rate Throttling**: Public authentication endpoints (`/api/auth/register`, `/api/auth/login`) are rate-limited via `throttle:10,1`.

---

## 3. Microservice & File Upload Security
- **CV PDF Parsing**: PDF uploads are validated for MIME type (`application/pdf`), constrained by maximum size limits (10 MB), sanitized against path traversal, and executed within safe memory sandboxes in the Python FastAPI AI service.

---

*HireAI Platform Security Specifications — v2.0*
