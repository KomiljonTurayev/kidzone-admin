# Push Notification History — Design Spec

**Date:** 2026-06-16
**Status:** Approved

## Context

The Push page currently stores only the last sent notification in localStorage and shows a single "Last sent" card with a Re-use button. Admins have no visibility into what was sent before that. This spec adds a scrollable history log of the last 50 sent notifications, replacing the single-entry card.

## Requirements

- **Storage:** localStorage only (no backend changes)
- **Limit:** 50 entries; oldest are dropped when the list exceeds 50
- **Action:** Clicking Re-use on any entry pre-fills the send form and focuses the Title field
- **Placement:** Same Push page, below the send form
- **History is append-only:** no delete per entry, no clear-all

## Architecture

### Hook: `src/hooks/usePushHistory.ts`

```ts
interface HistoryEntry {
  title: string;
  body: string;
  uid: string;   // empty string = broadcast to all users
  sentAt: string; // ISO timestamp
}
```

The hook manages `HistoryEntry[]` in React state, initialized lazily from localStorage on mount. It exposes:

- `history: HistoryEntry[]` — ordered newest-first
- `addEntry(title, body, uid)` — prepends entry, slices to 50, persists to localStorage

localStorage write errors are silently ignored (same pattern used by the existing `loadLast` helper).

### PushPage changes

- Remove `STORAGE_KEY`, `LastSent`, `loadLast`, `saveLast`, and the `last` state — replaced entirely by the hook
- Call `addEntry(title, body, uid)` in `onSuccess` after the toast
- Add a `titleRef` passed to the Title `<Input>` so Re-use can call `.focus()` after pre-filling

### History UI (inline in PushPage, below the send form)

Each row in a `<Card>`:
- **Left:** timestamp (`toLocaleString()`), target (`uid` truncated to 16 chars + "…" or "All users"), title + body preview
- **Right:** Re-use button (variant="outline" size="sm")

Empty state: "No notifications sent yet." in muted text.

No pagination — all entries scroll.

## Data Flow

```
User submits form
  → sendPush() succeeds
  → toast.success(...)
  → addEntry(title, body, uid)   ← hook prepends + persists
  → form clears, history list re-renders with new top entry

User clicks Re-use on entry E
  → setTitle(E.title), setBody(E.body), setUid(E.uid)
  → titleRef.current.focus()
```

## Files Changed

| File | Change |
|---|---|
| `src/hooks/usePushHistory.ts` | New — localStorage history hook |
| `src/pages/PushPage.tsx` | Remove old last-sent logic, integrate hook, add history list |

## Out of Scope

- Backend persistence
- Delete / clear history
- Pagination
- Unban user (separate backend endpoint needed)
