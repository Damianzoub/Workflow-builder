# Damian Workflow Builder — Design Spec
**Date:** 2026-05-08
**Status:** Approved

## Overview

An internal visual workflow builder for the company — a mini Langflow / Airia / ElevenLabs hybrid. Users visually compose AI automation workflows by dragging nodes onto a canvas, wiring them together, configuring each node, and running them. Internal use only (5+ dev team). Built on Google Cloud.

---

## Project Structure

**Turborepo monorepo** (`pnpm` workspaces).

```
workflow-builder/
├── apps/
│   ├── web/          ← Next.js 15, React Flow, Zustand, Tailwind, shadcn/ui [TypeScript]
│   ├── api/          ← FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, JWT, WebSockets [Python]
│   └── worker/       ← ARQ + Redis async task worker [Python]
├── packages/
│   └── ui/           ← Shared React components (shadcn base) [TypeScript]
├── docker-compose.yml  ← Postgres 16 + Redis 7 + Mailpit (local dev)
├── turbo.json
├── Makefile
└── package.json      ← pnpm workspace root
```

**Type sharing strategy:** FastAPI auto-generates `/openapi.json` from Pydantic models. Running `pnpm openapi-ts` generates `apps/web/src/types/api.ts`. Re-run whenever the API changes. No manual type sync required.

**Local dev:** `make dev` (or `pnpm dev`) starts all three apps in parallel via Turbo, with Docker providing Postgres, Redis, and Mailpit.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React Flow, Zustand, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, python-jose, slowapi |
| Worker | ARQ (async Redis queue) |
| Database | PostgreSQL 16 |
| Cache / Queue | Redis 7 |
| Package managers | pnpm (JS), uv (Python) |
| Local email | Mailpit (SMTP catcher in Docker) |
| Prod email | SMTP via env vars (SendGrid / GCP — configured later) |

---

## Auth Flow

### Register
1. `POST /auth/register` `{ name, email, password }` — creates user with `is_verified=false`, hashes password with bcrypt (cost 12)
2. Sends verification email containing a signed JWT link (expires 24h)
3. `GET /auth/verify?token=<jwt>` — sets `is_verified=true`, redirects to `/login`

### Login
1. `POST /auth/login` `{ email, password }` — verifies hash + checks `is_verified`
2. Returns:
   - `access_token` — JWT, 15 min, stored in Zustand (memory only)
   - `refresh_token` — JWT, 7 days, stored in `httpOnly` cookie
3. `POST /auth/refresh` — silent token rotation (called automatically before access token expires)

### Forgot Password
1. `POST /auth/forgot-password` `{ email }` — always returns `200` regardless of whether email exists (no enumeration)
2. Sends reset email with signed JWT link (expires 1h)
3. User lands on `/reset-password?token=<jwt>`
4. `POST /auth/reset-password` `{ token, new_password }` — updates hash, redirects to `/login`

### Security
- Passwords: bcrypt, cost factor 12
- Rate limiting on all auth endpoints via `slowapi`
- Forgot-password always returns 200 (no email enumeration)
- Access token in memory (XSS-safe), refresh token in httpOnly cookie (CSRF-safe with SameSite=Strict)

---

## UI / UX — Langflow-inspired

Dark-theme canvas interface modelled on Langflow.

### Layout
```
┌─────────────────────────────────────────────────────┐
│  TOP BAR: workflow name · API · Share · ▶ Run       │
├──────────────┬──────────────────────────────────────┤
│ COMPONENT    │                                      │
│ SIDEBAR      │         CANVAS                       │
│              │  (dark, dot grid, nodes + edges)     │
│ - search     │                                      │
│ - categories │                          ┌─────────┐ │
│ - drag cards │                          │ CONFIG  │ │
│              │                          │ PANEL   │ │
├──────────────┴──────────────────────────────────────┤
│  STATUS BAR: node count · zoom · run status         │
└─────────────────────────────────────────────────────┘
```

### Canvas
- Near-black background (`#0f0f0f`) with dot grid (`24px` spacing)
- Drag nodes from sidebar onto canvas
- Bezier edges with dashed animation and arrow tips
- Mini-map + zoom controls bottom-right

### Nodes
Each node is a dark card with a colored accent per type:

| Type | Colour | Handles |
|---|---|---|
| Trigger | Orange `#fb923c` | 1 output (right) |
| LLM | Deep violet `#7c3aed` | 1 input (left) · 1 output (right) |
| Tool | Green `#34d399` | 1 input (left) · 1 output (right) |
| Condition | Lavender `#a78bfa` | 1 input (left) · true output (green `#34d399`) · false output (red `#f87171`) |

Selected node gets a colored glow ring.

### Component Sidebar
- Collapsible, searchable
- Nodes grouped by category: Inputs, AI Models, Logic, Tools
- Each entry shows icon + name + short description
- Drag onto canvas to instantiate

### Config Panel
- Opens on node click (right panel slides in)
- Inline field editing per node type
- Shows input/output port connections

---

## Phase 1 Scope — Canvas & Auth

### Pages (`apps/web`)

| Route | Description |
|---|---|
| `/login` | Email + password login form |
| `/register` | Name + email + password registration form |
| `/verify-email` | Confirmation page after clicking email link |
| `/forgot-password` | Enter email to receive reset link |
| `/reset-password` | Enter new password (token in query param) |
| `/dashboard` | List of user's workflows — create, rename, delete |
| `/workflows/[id]` | The canvas editor |

### API Endpoints (`apps/api`)

**Auth**
- `POST /auth/register`
- `GET  /auth/verify`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

**Workflows**
- `GET    /workflows` — list user's workflows
- `POST   /workflows` — create workflow
- `GET    /workflows/{id}` — load workflow graph
- `PUT    /workflows/{id}` — save workflow graph
- `DELETE /workflows/{id}` — delete workflow

### Data Model (`apps/api` — SQLAlchemy + Alembic)

**User**
```
id            UUID PK
name          str
email         str UNIQUE
password_hash str
is_verified   bool default=false
created_at    datetime
```

**Workflow**
```
id           UUID PK
user_id      UUID FK → User
name         str
description  str nullable
graph        JSONB   ← { nodes: [...], edges: [...] }
created_at   datetime
updated_at   datetime
```

### Phase 1 Node Types
- **Trigger** — entry point, no config beyond a name
- **LLM** — model selector (OpenAI/Claude/Gemini), system prompt, temperature, input mapping
- **Tool** — HTTP method, URL, headers, body template
- **Condition** — expression field (`intent == "booking"`)

The ▶ Run button is visible in the top bar but **disabled** in Phase 1 — execution is Phase 2.

### Phase 1 Deliverable
A working canvas where authenticated team members can create workflows, drag and configure nodes, wire them together, and save/load the graph as JSON.

---

## Phases 2–4 (future — not in scope for this plan)

- **Phase 2:** Execution engine — ARQ worker, DAG runner, async task queue, retry logic, state persistence, WebSocket live status updates
- **Phase 3:** Advanced nodes (RAG, Memory, Webhook, Human-in-loop) + integrations (Google Calendar, Gmail, Whisper, Pinecone)
- **Phase 4:** Platform features — REST trigger API, run history + logs, usage metering, workflow templates

---

## Open Items

- Email provider for production: GCP email API or SendGrid (decided when GCP infra is set up)
- Authentication for GCP deployment (Cloud Run / Cloud SQL / Memorystore) — deferred to Phase 2
- CI/CD pipeline — deferred, but Turborepo's `turbo.json` pipeline is designed to slot in
