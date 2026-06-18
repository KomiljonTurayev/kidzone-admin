# Admin Banners UI — Design Spec

**Date:** 2026-06-18
**Project:** kidzone-admin (React + TypeScript + shadcn/ui + React Query)

## Context

The backend already exposes a full banner CRUD API (`/admin/banners`). This spec covers the admin frontend: a Banners page for listing, creating, editing, and deleting banners, following the exact same patterns used by UsersPage, StatsPage, and PushPage.

## Routes

| Path | Component | Purpose |
|---|---|---|
| `/banners` | `BannersPage` | List all banners, delete |
| `/banners/new` | `BannerFormPage` | Create new banner |
| `/banners/:id/edit` | `BannerFormPage` | Edit existing banner |

## File Structure

**New files:**
- `src/api/banners.ts` — API calls (listBanners, getBanner, createBanner, updateBanner, deleteBanner)
- `src/hooks/useBanners.ts` — React Query hooks (useBanners, useBanner, useCreateBanner, useUpdateBanner, useDeleteBanner)
- `src/pages/BannersPage.tsx` — list + delete
- `src/pages/BannerFormPage.tsx` — shared create/edit form

**Modified files:**
- `src/types.ts` — add `BannerDto` and `BannerRequest` interfaces
- `src/App.tsx` — add three banner routes inside the existing PrivateRoute/Layout wrapper
- `src/components/Layout.tsx` — add "Banners" nav item with Image icon from lucide-react

## Types

```ts
interface BannerDto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  targetAgeGroup: string | null;
  active: boolean;
  startDate: string;
  endDate: string;
  order: number;
  createdAt: string | null;
}

interface BannerRequest {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  targetAgeGroup: string | null;
  active: boolean;
  startDate: string;
  endDate: string;
  order: number;
}
```

## BannersPage

- Heading "Banners" + "New Banner" button (links to `/banners/new`)
- Table columns: Order, Title, Target (All / age group), Active (green/grey badge), Start Date, End Date, Actions
- Actions per row: Edit button (links to `/banners/:id/edit`), Delete button
- Delete: `window.confirm` → `useDeleteBanner` mutation → toast success/error (same pattern as UsersPage deleteUser)
- Loading state: spinner; error state: error message

## BannerFormPage

- Detects create vs edit from route: `useParams()` — if `id` present, fetch with `useBanner(id)` and pre-fill form
- Fields:
  - Title (text input, required)
  - Description (textarea, required)
  - Image URL (text input, required)
  - Link (text input, required)
  - Target Age Group (select: "All users" / "3-5" / "6-8" / "9-12")
  - Active (checkbox)
  - Start Date (date input, required) — converted to ISO-8601 (`YYYY-MM-DDT00:00:00Z`) on submit
  - End Date (date input, required) — converted to ISO-8601 (`YYYY-MM-DDT23:59:59Z`) on submit
  - Order (number input, required, min 0)
- Submit: create → `useCreateBanner`, edit → `useUpdateBanner`
- On success: toast + `navigate('/banners')`
- On error: toast error

## API Layer

```ts
// src/api/banners.ts
listBanners()              → GET /admin/banners        → BannerDto[]
getBanner(id)              → GET /admin/banners/:id    → BannerDto
createBanner(data)         → POST /admin/banners       → BannerDto
updateBanner(id, data)     → PUT /admin/banners/:id    → BannerDto
deleteBanner(id)           → DELETE /admin/banners/:id → void
```

## Hooks

```ts
// src/hooks/useBanners.ts
useBanners()         — useQuery(['banners'])
useBanner(id)        — useQuery(['banners', id])
useCreateBanner()    — useMutation → invalidate ['banners']
useUpdateBanner()    — useMutation → invalidate ['banners']
useDeleteBanner()    — useMutation → invalidate ['banners']
```
