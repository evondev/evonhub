# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # Run ESLint
```

No test suite is configured. Verify changes by running the dev server.

## Architecture Overview

**Evonhub** is a Next.js 14 (App Router) e-learning platform with MongoDB/Mongoose, Clerk auth, Mux video, and UploadThing for file uploads.

### Directory Structure

```
src/
  app/              # Next.js App Router
    (dashboard)/    # All authenticated routes (dashboard layout)
      admin/        # Admin-only management pages (category, course, user, etc.)
      [course]/     # Course detail pages
      study/        # Study/lesson view
    api/
      uploadthing/  # UploadThing file upload handler
      webhook/      # Clerk webhook for user sync
  modules/          # Feature modules (each has actions/, components/, models/, services/, types/)
    course/ coupon/ comment/ email/ history/ lecture/ lesson/ micro/ notifications/ order/ rating/ score/ user/
  shared/           # Cross-module shared code
    actions/        # Shared server actions
    components/     # Shared UI components (course-list, dashboard, icons, etc.)
    constants/      # Enums and constants (CourseStatus, UserRole, MembershipPlan, etc.)
    helpers/        # Pure utility functions
    hooks/          # Shared React hooks
    libs/           # Infrastructure: mongoose connection, react-query setup
    types/          # Shared TypeScript types
  components/       # Legacy/global UI components and shadcn/ui primitives
  store/            # Zustand global store (useGlobalStore)
  database/         # Mongoose model definitions (legacy location)
  types/            # Global type declarations
```

### Module Pattern

Each feature module in `src/modules/` follows this structure:
- `actions/` — Next.js Server Actions (`"use server"`)
- `models/` — Mongoose schema and model
- `services/` — Business logic called by actions
- `components/` — React components specific to the module
- `types/` — TypeScript interfaces for the module

Import from `@/modules/<name>/actions`, `@/modules/<name>/models`, etc.

### Data Layer

- **Database**: MongoDB via Mongoose, connected through `connectToDatabase()` from `@/shared/libs`
- **Database name**: `EvonHub`
- Every server action must call `connectToDatabase()` before any DB operation
- Models are defined per-module; the `src/database/` directory contains legacy model definitions
- Server actions use `auth()` from `@clerk/nextjs/server` for auth context

### Auth

- Clerk handles authentication; middleware in `src/middleware.ts` protects all routes
- User roles: `ADMIN`, `EXPERT`, `USER` (from `UserRole` enum)
- Permissions are granular (e.g., `create:course`) stored on the user record
- Membership plans: `personal` (1mo), `starter` (3mo), `master` (6mo), `premium` (12mo)
- Global user state (role, permissions, membership status) is persisted in Zustand (`useGlobalStore`)

### Key Integrations

- **Mux**: Video upload and streaming via `@mux/mux-uploader-react` and `@mux/mux-player-react`
- **UploadThing**: Image/file uploads; handler at `src/app/api/uploadthing/`
- **Clerk webhooks**: User sync at `src/app/api/webhook/`; keeps local user records in sync with Clerk
- **React Query**: Data fetching/caching; query keys are in `src/shared/constants/react-query.constants.ts`

### UI

- **shadcn/ui** components (Radix UI primitives) live in `src/components/ui/`
- **Tailwind CSS** for styling; config in `tailwind.config.ts`
- **million.js** compiler wraps the Next.js config for React performance optimization
- Theme support via `next-themes`; dark/light toggle in `src/components/ModeToggle.tsx`
- Toast notifications use `react-toastify`; alerts use `sweetalert2`

### Path Aliases

`@/` maps to `src/` (configured in `tsconfig.json`).
