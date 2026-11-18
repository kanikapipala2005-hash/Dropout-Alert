# Project memory

## Product intent & audience

- **Project:** "dropout-alert" — Student Dropout Early-Warning System
- **Purpose:** College DBMS PBL (Project-Based Learning) project aligned with SDG 4 (Quality Education)
- **Audience:** College faculty / administrators monitoring at-risk students for dropout prevention
- **Scope:** Single-page dashboard app; no authentication required

## Brand personality & voice

- Professional, academic, data-focused
- Clear and informative; educational tone in DBMS concepts section
- Utility-first; emphasizes actionable risk status

## Visual design & UX direction

- **Theme:** Modern, clean college dashboard; dark blue header (`#1a365d`), white background
- **Risk colors:** HIGH = red, MEDIUM = yellow/amber, SAFE = green
- **Layout:** Header → live-count dashboard cards → add-student form → student table → DBMS info section
- **Responsive:** Fully responsive, mobile to desktop
- **Stack:** Tailwind CSS, React hooks, Lucide React icons, `@/` path alias → `src/`
- **Components:** Color-coded risk badges, live "Predicted Risk" badge in form, copy-to-clipboard code blocks, collapsible DBMS panel, real-time search & filter

## Decisions, constraints & rationale

- **Persistence:** Browser localStorage only (no backend); data survives reloads
- **Risk scoring logic:** Attendance <60% → +1, Fees Pending → +1, Marks <40 → +1; total 3 = HIGH, 2 = MEDIUM, 0–1 = SAFE
- **Demo data:** 5 pre-loaded students spanning all risk levels; "Reset Demo Data" button restores them
- **DBMS section:** Demonstrative SQL examples (JOIN across students/attendance/fees/marks, GROUP BY, HAVING) + PL/pgSQL trigger example — shown as code, not executed
- **No dummy buttons:** Every button is functional (add, delete, search, filter, reset, copy)
- **No extra UI packages** beyond Tailwind + Lucide React unless explicitly requested
- Explicit user/brand instructions live in `.bolt/prompt` and are not duplicated here

## Open questions & assumptions

- Risk thresholds (60% attendance, 40 marks) are hardcoded; could be made configurable in future
- localStorage is per-browser; no cross-device sync
- DBMS SQL section is educational/demo only; no live database connection
- Roll number uniqueness not enforced in current implementation