# SpecForge v2 — Project Orchestrator

SpecForge is a guided, multi-step wizard that generates Spring Boot microservice scaffolding from an OpenAPI / Swagger specification. After the configuration wizard completes, the app transitions into an IDE-style **API Explorer** where the generated project's file tree and mock endpoints can be browsed and executed.

## What it does

1. **Import** — Paste an OpenAPI 3.x or Swagger 2.0 JSON URL, or drag-and-drop a `.json` file.
2. **Configure** — Set project metadata (purpose code, repo, branch), choose a technology stack (Java version, Spring Boot, build tool, dependencies), and pick an architecture pattern via an interactive carousel (Hexagonal 3-Module, Hexagonal 4-Module, Multi-Module).
3. **Build Setup** — Choose between a Quick Build or a full ING Starter Kit pipeline configuration (Azure DevOps, Helm, Maven, Image, TPA).
4. **Review** — Inspect the full collected configuration as a live JSON tree before generating.
5. **Generate** — A simulated build pipeline runs 8 sequential steps with live progress.
6. **Explore** — The post-build API Explorer shows the scaffold file tree, lists mock endpoints, and lets you run them to see simulated responses.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19, shadcn/ui (radix-maia), Tailwind CSS v4 |
| Components | Radix UI primitives, Embla Carousel, cmdk, Sonner toasts |
| Icons | Lucide React |
| Theming | next-themes (dark / light / system) |
| Testing | Vitest, React Testing Library, happy-dom |
| Package manager | Bun |

## Project structure

```
specforge-v2/
├── app/
│   ├── layout.tsx                 Root layout (fonts, theme, toaster)
│   ├── page.tsx                   Entry point — renders the wizard inside an ErrorBoundary
│   ├── globals.css                Tailwind 4 theme variables
│   └── api/                       Next.js API routes (mock endpoints)
│       ├── build-steps/route.ts   GET /api/build-steps
│       └── explorer/
│           ├── file-tree/route.ts GET /api/explorer/file-tree
│           └── endpoints/route.ts GET /api/explorer/endpoints
├── components/
│   ├── component-example.tsx      Main wizard orchestrator + step components
│   ├── wizard-layout.tsx          Shared wizard shell (stepper, nav buttons)
│   ├── error-boundary.tsx         React error boundary with recovery UI
│   ├── steps/
│   │   ├── upload-spec-step.tsx   Step 1: spec import
│   │   ├── build-logs-step.tsx    Step 5: build simulation
│   │   └── api-testing-step.tsx   Post-wizard API Explorer
│   ├── json-tree-viewer.tsx       Collapsible interactive JSON viewer
│   └── ui/                        shadcn-style primitive components (25 files)
├── lib/
│   ├── utils.ts                   cn() helper (clsx + tailwind-merge)
│   └── openapi-validator.ts       Client-side OpenAPI/Swagger fetcher + validator
├── public/architectures/          HTML diagrams rendered in iframes
├── docs/
│   ├── API_MIGRATION_GUIDE.md     Guide for swapping mock APIs to real backends
│   └── HACKATHON_SCORECARD.md     Self-assessment against the hackathon rubric
└── __tests__/                     Vitest test suite (46 tests)
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ (or any runtime that Bun supports)
- [Bun](https://bun.sh) (recommended) or npm / pnpm

### Install & run

```bash
# 1. Install dependencies
bun install

# 2. Start the development server
bun dev

# 3. Open in browser
# http://localhost:3000
```

### Run tests

```bash
# Single run
bun test

# Watch mode (re-runs on file change)
bun test:watch

# With coverage report
bun test:coverage
```

## API routes

All three routes return hard-coded JSON and are designed to be swapped for real backend calls with minimal changes. See [`docs/API_MIGRATION_GUIDE.md`](docs/API_MIGRATION_GUIDE.md) for the full migration playbook.

| Route | Purpose |
|---|---|
| `GET /api/build-steps` | Returns the 8 build-pipeline step definitions |
| `GET /api/explorer/file-tree` | Returns the generated project file tree |
| `GET /api/explorer/endpoints` | Returns the list of mock API endpoints |

## Architecture decisions

- **Single-page wizard** — All state lives in a single React component (`ComponentExample`) using `useState`. No external state library is needed for a linear 5-step flow.
- **Path-based updater** — A generic `updateProjectData(path, value)` function handles arbitrarily nested state mutations via string-path arrays, avoiding prop-drilling boilerplate.
- **Iframe architecture diagrams** — Each architecture pattern is an self-contained HTML file in `public/architectures/`. They receive dark/light theme via `postMessage`, keeping them fast and dependency-free.
- **Error boundary** — A class-based `ErrorBoundary` wraps the entire app. Any unhandled exception shows a recovery UI instead of a blank screen.
- **HTML escaping in JSON viewer** — The syntax-highlighted JSON viewer escapes all HTML entities before applying highlight spans, preventing XSS if user-controlled content flows through.

## Contributing

1. Fork or clone the repo.
2. Create a feature branch.
3. Run `bun test` — all 46 tests must pass.
4. Open a pull request.
