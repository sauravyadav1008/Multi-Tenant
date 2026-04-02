# Multi-Tenant SaaS Platform

<p align="center">
	<img alt="Monorepo" src="https://img.shields.io/badge/Monorepo-Multi--Tenant-1f6feb?style=for-the-badge" />
	<img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-0ea5e9?style=for-the-badge" />
	<img alt="Backend" src="https://img.shields.io/badge/Backend-Node%20%2B%20Express-22c55e?style=for-the-badge" />
	<img alt="Database" src="https://img.shields.io/badge/Database-PostgreSQL-6366f1?style=for-the-badge" />
	<img alt="ORM" src="https://img.shields.io/badge/ORM-Prisma-f97316?style=for-the-badge" />
</p>

<p align="center">
	Startup-grade, multi-tenant SaaS foundation with secure auth, tenant isolation patterns, and a modern frontend shell.
</p>

---

## Jump To

- [Project Snapshot](#project-snapshot)
- [Architecture View](#architecture-view)
- [Repository Map](#repository-map)
- [Local Development](#local-development)
- [Auth Flow](#auth-flow)
- [Roadmap](#roadmap)

## Project Snapshot

| Area | Status | Notes |
|---|---|---|
| Frontend | Active | React + TypeScript + Vite, animated UI, auth wiring connected |
| Backend | Active | Express + Prisma APIs, secure auth and refresh-token rotation |
| Database | In Progress | PostgreSQL required for migrations and runtime |
| Infra | Scaffolded | Root infrastructure folders and CI placeholder created |

## Architecture View

| Layer | Responsibilities | Stack |
|---|---|---|
| Web App | Dashboard UI, workspace, auth controls, API consumption | React, TypeScript, Vite, Zustand, React Query |
| API | Authentication, tenant-aware business logic, validation | Node.js, Express, Zod |
| Data | Tenants, users, projects, refresh sessions | PostgreSQL, Prisma |
| Security | Access tokens, refresh cookies, rotation/revocation | JWT, httpOnly cookies, session hashing |

## Repository Map

| Path | Purpose |
|---|---|
| saas-backend/ | Backend services and Prisma schema/migrations |
| saas-frontend/ | Frontend application |
| docs/ | Architecture and product documentation |
| scripts/ | Automation and setup scripts |
| infra/docker/ | Container assets |
| infra/nginx/ | Reverse proxy and gateway assets |
| .github/workflows/ | CI/CD workflows |

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm 10+

### 1. Run Backend

		cd saas-backend
		npm install
		# create .env based on .env.example
		npx prisma migrate deploy
		npm run dev

Backend default: http://localhost:5000

### 2. Run Frontend

		cd saas-frontend
		npm install
		npm run dev

Frontend default: http://localhost:5173

The frontend is configured to proxy /api to backend during local development.

<details>
	<summary>Build Commands</summary>

	Frontend build:

			cd saas-frontend
			npm run build

	Backend check (current):

			cd saas-backend
			npm run dev

</details>

## Auth Flow

<details>
	<summary>Click to expand auth lifecycle</summary>

1. Register or login returns:
	 - access token in response body
	 - refresh token in secure httpOnly cookie
2. Frontend stores access token in app state.
3. When access expires, frontend calls refresh endpoint.
4. Backend rotates refresh session and issues new tokens.
5. Logout and logout-all revoke active refresh sessions.

</details>

## Roadmap

- Add production CI pipeline in .github/workflows
- Complete billing and Stripe integration
- Add Redis-backed caching/session support
- Add Docker Compose and Nginx production gateway
- Expand tests for auth and tenant isolation

---

## Contribution Style

- Keep modules tenant-aware
- Validate all input at route boundaries
- Favor explicit, secure defaults
- Document major changes in docs/
