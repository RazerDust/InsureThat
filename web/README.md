# InsureThat Web

This folder contains the React frontend for InsureThat.

## What The App Uses

- React for building the user interface.
- TypeScript for safer JavaScript with helpful editor warnings.
- Vite for the local development server and production build.
- Mantine for UI components such as buttons, cards, tables, tabs, modals, and forms.
- React Query for loading, caching, and refreshing API data.
- Axios for HTTP requests to the .NET API.

## Run Locally

```bash
pnpm install
pnpm dev
```

The app normally runs at `http://localhost:5173`.

## Environment Variables

The frontend reads `VITE_API_BASE_URL` from Vite.

Example `web/.env.local`:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5105/api
```

If this variable is missing, the app defaults to `/api`, and Vite proxies `/api` to `http://127.0.0.1:5105` during local development.

## Useful Commands

```bash
pnpm dev
```

Starts the local development server.

```bash
pnpm lint
```

Checks the code for common TypeScript and React mistakes.

```bash
pnpm build
```

Creates a production build and checks TypeScript.

```bash
pnpm preview
```

Serves the production build locally after `pnpm build`.

## Source Folder Guide

- `src/main.tsx` starts React in the browser.
- `src/app/` contains the top-level app, providers, and routes.
- `src/api/` contains shared API and caching setup.
- `src/components/` contains reusable UI pieces.
- `src/features/auth/` contains login and session code.
- `src/features/crm/` contains CRM screens, data, API calls, and hooks.
- `src/features/dashboard/` contains the dashboard page and metric cards.
- `src/features/users/` contains tenant and user administration screens.
- `src/styles/global.css` contains app-wide layout and visual styling.

## How Data Flows

1. A page calls a feature hook, such as `useCrmAccounts`.
2. The hook asks React Query to run an API function.
3. The API function uses `axiosClient` to call the backend.
4. React Query stores the response in its cache.
5. The page renders tables, cards, and forms from that cached data.

## Beginner Notes

The code includes plain-English comments near important decisions. Start with `src/main.tsx`, then read `src/app/router.tsx`, then open one feature folder such as `src/features/crm/` to see how a page, hook, API file, and types work together.
