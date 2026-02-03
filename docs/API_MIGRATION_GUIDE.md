# API Migration Guide — Replacing Mock Routes with Backend APIs

This document walks you through every step required to swap the current
Next.js mock API routes for the real backend endpoints your team is building.
Nothing in the frontend components needs to change other than the three
route files listed below (and, optionally, an environment variable for the
base URL).

---

## Table of Contents

1. [What exists today](#1-what-exists-today)
2. [Option A — Backend runs on the same origin (default)](#2-option-a--backend-on-the-same-origin)
3. [Option B — Backend runs on a separate host](#3-option-b--backend-on-a-separate-host)
4. [Route-by-route replacement details](#4-route-by-route-replacement-details)
   - 4.1 `GET /api/build-steps`
   - 4.2 `GET /api/explorer/file-tree`
   - 4.3 `GET /api/explorer/endpoints`
5. [Contract (expected JSON shapes)](#5-contract--expected-json-shapes)
6. [Testing locally](#6-testing-locally)
7. [Deploying to a server](#7-deploying-to-a-server)
8. [Checklist](#8-checklist)

---

## 1. What exists today

| Route | Mock file | Consumed by |
|---|---|---|
| `GET /api/build-steps` | `app/api/build-steps/route.ts` | `components/steps/build-logs-step.tsx` |
| `GET /api/explorer/file-tree` | `app/api/explorer/file-tree/route.ts` | `components/steps/api-testing-step.tsx` |
| `GET /api/explorer/endpoints` | `app/api/explorer/endpoints/route.ts` | `components/steps/api-testing-step.tsx` |

Each mock route is a Next.js App-Router API route that returns a hard-coded
JSON array.  The frontend components `fetch()` these paths on mount with
no base URL prefix — they are relative to the Next.js origin.

There is also an **external** fetch in `lib/openapi-validator.ts` that hits
a user-supplied OpenAPI URL.  That one is already fully dynamic and does
not need any changes.

---

## 2. Option A — Backend on the same origin

Use this when your backend will be served from the same host and port as
the Next.js app (e.g. the backend is behind the same reverse-proxy / load
balancer, or it runs as a sidecar on the same pod).

### Steps

1. Open the relevant route file (see Section 4).
2. Replace the hard-coded array and `NextResponse.json(...)` with a call
   to your backend.  The template below works for all three routes — just
   change the internal URL.

```typescript
import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch("http://localhost:8080/your/internal/endpoint", {
    // If your backend needs specific headers, add them here
    headers: {
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream returned ${res.status}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
```

3. Keep the exported TypeScript interface in the file unchanged.
   The frontend imports it with `import type { ... }` purely for
   compile-time checks — it is stripped at build time and has no runtime
   effect, so it does not need to match the real backend schema byte-for-byte,
   only structurally.
4. Run `npm run dev` and verify in the browser (see Section 6).

---

## 3. Option B — Backend on a separate host

Use this when your backend is deployed independently (different port,
different domain, or a cloud service).

### Steps

1. Create (or update) a `.env.local` file at the project root:

```env
# Base URL of your backend — no trailing slash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

   For production replace the value with your real deployed URL.

2. Update each route file to read the env variable:

```typescript
import { NextResponse } from "next/server"

const BACKEND_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

export async function GET() {
  const res = await fetch(`${BACKEND_BASE}/your/backend/path`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream returned ${res.status}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
```

3. If you are deploying to Vercel or a similar platform that restricts
   outbound fetches, add your backend's origin to the `allowed` list in
   `next.config.ts` (or `next.config.js`):

```typescript
/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ]
  },
}
```

4. Run `npm run dev` and verify (see Section 6).

---

## 4. Route-by-route replacement details

### 4.1 `GET /api/build-steps`

| Item | Detail |
|---|---|
| File to edit | `app/api/build-steps/route.ts` |
| Current behaviour | Returns 8 hard-coded build-pipeline steps |
| What your backend must return | A JSON array of `BuildStep` objects (see Section 5) |
| Interface to keep | `BuildStep` (already exported from this file) |

### 4.2 `GET /api/explorer/file-tree`

| Item | Detail |
|---|---|
| File to edit | `app/api/explorer/file-tree/route.ts` |
| Current behaviour | Returns a hard-coded nested file-tree |
| What your backend must return | A JSON array of `FileTreeNode` objects (see Section 5) |
| Interface to keep | `FileTreeNode` (already exported from this file) |

### 4.3 `GET /api/explorer/endpoints`

| Item | Detail |
|---|---|
| File to edit | `app/api/explorer/endpoints/route.ts` |
| Current behaviour | Returns 4 hard-coded API endpoints |
| What your backend must return | A JSON array of `ExplorerEndpoint` objects (see Section 5) |
| Interface to keep | `ExplorerEndpoint` (already exported from this file) |

---

## 5. Contract — expected JSON shapes

Your backend must return arrays that match these shapes exactly.
Fields marked with `?` are optional.

### BuildStep

```json
[
  {
    "id": 1,
    "label": "Initializing Project",
    "description": "Setting up project structure",
    "apiEndpoint": "/api/initialize"
  }
]
```

| Field | Type | Required |
|---|---|---|
| `id` | `number` | Yes |
| `label` | `string` | Yes |
| `description` | `string` | Yes |
| `apiEndpoint` | `string` | Yes |

### FileTreeNode

Recursive structure — each node can contain child nodes of the same shape.

```json
[
  {
    "name": "src",
    "type": "folder",
    "children": [
      {
        "name": "main.java",
        "type": "file"
      }
    ]
  }
]
```

| Field | Type | Required |
|---|---|---|
| `name` | `string` | Yes |
| `type` | `"file"` or `"folder"` | Yes |
| `children` | `FileTreeNode[]` | No (omit for files) |
| `icon` | `string` | No |

### ExplorerEndpoint

```json
[
  {
    "method": "GET",
    "path": "/api/mock/hello",
    "description": "Simple health check and greeting endpoint.",
    "hasAI": false,
    "status": "SERVER_STOPPED"
  }
]
```

| Field | Type | Required |
|---|---|---|
| `method` | `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`, or `"PATCH"` | Yes |
| `path` | `string` | Yes |
| `description` | `string` | Yes |
| `hasAI` | `boolean` | No |
| `status` | `"SERVER_STOPPED"`, `"OPEN"`, `"RUNNING"`, or `"ERROR"` | No |

---

## 6. Testing locally

1. Start your backend service on the port you configured
   (default example: `http://localhost:8080`).
2. In a separate terminal, start the Next.js dev server:

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser.
4. Walk through the wizard until you reach **Build Logs** (step 5).
   The vertical stepper should populate with whatever your backend returns
   at `/api/build-steps`.
5. Complete the build and click **Open API Explorer**.
   The left-hand file tree and the endpoint list should now come from your
   backend's `/api/explorer/file-tree` and `/api/explorer/endpoints`.
6. To confirm the data is actually coming from your backend and not a
   stale cache, change one label or add an endpoint on the backend side,
   then hard-refresh the page and verify the change appears.

### Quick smoke-test with curl

You can hit the Next.js proxy routes directly to make sure they forward
correctly:

```bash
# Build steps
curl http://localhost:3000/api/build-steps

# File tree
curl http://localhost:3000/api/explorer/file-tree

# Endpoints
curl http://localhost:3000/api/explorer/endpoints
```

Each should return a JSON array sourced from your backend.

---

## 7. Deploying to a server

1. Set the environment variable on your deployment platform:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com
```

   Most platforms (Vercel, AWS Amplify, Railway, etc.) have a UI or CLI
   for this. If you are using a `.env` file on the server, name it
   `.env.production` or `.env.local` depending on the platform.

2. Make sure your backend's CORS policy allows requests from the
   Next.js origin.  A minimal permissive header on the backend side:

```
Access-Control-Allow-Origin: https://your-frontend.example.com
```

3. Run the production build:

```bash
npm run build
npm start
```

4. Verify with the same curl commands from Section 6, replacing
   `localhost:3000` with your deployed frontend URL.

---

## 8. Checklist

- [ ] Confirm backend endpoints are live and return the correct JSON shapes (Section 5)
- [ ] Decide on Option A or Option B and update the three route files accordingly
- [ ] If Option B: add `NEXT_PUBLIC_API_BASE_URL` to `.env.local` (dev) and the deployment platform (prod)
- [ ] Keep the exported TypeScript interfaces (`BuildStep`, `FileTreeNode`, `ExplorerEndpoint`) in each route file
- [ ] Run `npm run dev` and smoke-test all three routes with curl
- [ ] Walk through the full wizard in the browser end-to-end
- [ ] If deploying: set env var on the platform, configure CORS on the backend, run `npm run build && npm start`, and re-verify
