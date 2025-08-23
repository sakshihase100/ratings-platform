# Ratings Platform Backend (Express + Sequelize + MySQL)

## Setup
1. Copy `.env.example` to `.env` and set MySQL credentials + JWT secret.
2. Install deps: `npm install`
3. Create DB: `CREATE DATABASE ratings_platform;` (or match your DB_NAME).
4. Sync tables: `npm run sync` (or auto-sync on first `npm run dev`).
5. Start: `npm run dev`

## API Overview
- `POST /auth/register` — normal user signup
- `POST /auth/login` — login returns JWT
- `PUT /auth/change-password` — after login

- `GET /admin/dashboard` — totals (admin only)
- `POST /admin/users` — add user (admin only)
- `GET /admin/users` — list with filters/sort (admin only)
- `GET /admin/users/:id` — user details (admin only)
- `POST /admin/stores` — add store (admin only)
- `GET /admin/stores` — list stores + average rating (admin only)

- `GET /stores` — list stores + avg + my rating (any logged-in user)
- `POST /stores/:id/rate` — submit/modify rating (any logged-in user)

- `GET /owner/dashboard` — owner’s raters + average (owner only)

## Notes
- All tables support filters & sorting via query params.
- Server-side validation matches the challenge specification.
