# InsureThat

InsureThat is an insurance operations workspace with a React frontend and a .NET API backend.

The current app includes:

- A dashboard with portfolio metrics.
- A CRM workspace for accounts, contacts, policies, tasks, documents, and account detail pages.
- A tenant and user administration area that demonstrates row-level security rules.
- In-memory backend repositories so the app can run locally before a database is added.

## Folder Guide

- `web/` contains the React, TypeScript, Vite, Mantine, and React Query frontend.
- `server/` contains the .NET solution, API project, application contracts, infrastructure repositories, and test projects.
- `.gitignore` keeps generated dependency and build folders out of Git.

## Run The Frontend

```bash
cd web
pnpm install
pnpm dev
```

The frontend usually opens at `http://localhost:5173`.

## Run The Backend

```bash
cd server
dotnet restore
dotnet run --project src/Api/Api.csproj --urls http://127.0.0.1:5105
```

The API uses in-memory data today. That means records reset when the backend process restarts.

## Connect Frontend To Backend

Create `web/.env.local` if you need to point Vite at a specific API URL:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5105/api
```

If the CRM API is not running, the CRM overview falls back to local sample data so the page still renders.

## Quality Checks

```bash
cd web
pnpm lint
pnpm build
```

```bash
cd server
dotnet test
```

## Comment Style

This codebase intentionally includes beginner-friendly comments. The comments explain why files, hooks, repositories, and UI sections exist so a new developer can follow the flow without needing to know every framework detail first.
