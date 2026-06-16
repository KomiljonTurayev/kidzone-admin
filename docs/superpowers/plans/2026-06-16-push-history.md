# Push Notification History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scrollable history log of the last 50 sent push notifications to the Push page, with a Re-use button on each entry that pre-fills the send form.

**Architecture:** A new `usePushHistory` hook manages a `HistoryEntry[]` in React state backed by localStorage (key `push_history`, capped at 50). `PushPage` calls `addEntry` on success and renders the history list below the send form. The existing single-entry "Last sent" card and its helpers (`STORAGE_KEY`, `LastSent`, `loadLast`, `saveLast`, `last` state) are removed entirely.

**Tech Stack:** React 19, TypeScript, Vitest + @testing-library/react (jsdom), shadcn/ui, Tailwind CSS

---

## File Map

| File | Action |
|---|---|
| `src/hooks/usePushHistory.ts` | **Create** — hook + `HistoryEntry` type |
| `src/test/usePushHistory.test.ts` | **Create** — unit tests for the hook |
| `src/pages/PushPage.tsx` | **Modify** — remove old last-sent logic, integrate hook, add history UI |

---

## Task 1: usePushHistory hook — failing tests

**Files:**
- Create: `src/test/usePushHistory.test.ts`

- [ ] **Step 1: Create the test file**

```ts
// src/test/usePushHistory.test.ts
import { renderHook, act } from '@testing-library/react';
import { usePushHistory } from '../hooks/usePushHistory';

describe('usePushHistory', () => {
  beforeEach(() => localStorage.clear());

  it('starts empty when localStorage has no entry', () => {
    const { result } = renderHook(() => usePushHistory());
    expect(result.current.history).toEqual([]);
  });

  it('loads existing history from localStorage on mount', () => {
    const entry = { title: 'T', body: 'B', uid: '', sentAt: '2026-01-01T00:00:00.000Z' };
    localStorage.setItem('push_history', JSON.stringify([entry]));
    const { result } = renderHook(() => usePushHistory());
    expect(result.current.history).toEqual([entry]);
  });

  it('addEntry prepends the new entry (newest first)', () => {
    const { result } = renderHook(() => usePushHistory());
    act(() => result.current.addEntry('First', 'Body1', ''));
    act(() => result.current.addEntry('Second', 'Body2', 'uid-1'));
    expect(result.current.history[0]).toMatchObject({ title: 'Second', uid: 'uid-1' });
    expect(result.current.history[1]).toMatchObject({ title: 'First', uid: '' });
  });

  it('addEntry writes the updated list to localStorage', () => {
    const { result } = renderHook(() => usePushHistory());
    act(() => result.current.addEntry('Hello', 'World', 'uid-1'));
    const stored = JSON.parse(localStorage.getItem('push_history')!);
    expect(stored[0]).toMatchObject({ title: 'Hello', body: 'World', uid: 'uid-1' });
  });

  it('addEntry sets sentAt to a valid ISO timestamp', () => {
    const before = new Date().toISOString();
    const { result } = renderHook(() => usePushHistory());
    act(() => result.current.addEntry('T', 'B', ''));
    const after = new Date().toISOString();
    const { sentAt } = result.current.history[0];
    expect(sentAt >= before).toBe(true);
    expect(sentAt <= after).toBe(true);
  });

  it('caps history at 50 entries, dropping the oldest', () => {
    const { result } = renderHook(() => usePushHistory());
    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.addEntry(`Title ${i}`, 'B', '');
      }
    });
    expect(result.current.history).toHaveLength(50);
    expect(result.current.history[0].title).toBe('Title 54');
    expect(result.current.history[49].title).toBe('Title 5');
  });

  it('returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('push_history', 'not-json{{{');
    const { result } = renderHook(() => usePushHistory());
    expect(result.current.history).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they all fail (hook doesn't exist yet)**

```
npx vitest run src/test/usePushHistory.test.ts
```

Expected: all 7 tests **FAIL** with `Cannot find module '../hooks/usePushHistory'`

---

## Task 2: usePushHistory hook — implementation

**Files:**
- Create: `src/hooks/usePushHistory.ts`

- [ ] **Step 1: Create the hook**

```ts
// src/hooks/usePushHistory.ts
import { useCallback, useState } from 'react';

export interface HistoryEntry {
  title: string;
  body: string;
  uid: string;
  sentAt: string;
}

const STORAGE_KEY = 'push_history';
const MAX = 50;

function load(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function persist(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage full or unavailable — silently skip
  }
}

export function usePushHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(load);

  const addEntry = useCallback((title: string, body: string, uid: string) => {
    setHistory((prev) => {
      const next = [{ title, body, uid, sentAt: new Date().toISOString() }, ...prev].slice(0, MAX);
      persist(next);
      return next;
    });
  }, []);

  return { history, addEntry };
}
```

- [ ] **Step 2: Run tests to verify they all pass**

```
npx vitest run src/test/usePushHistory.test.ts
```

Expected: all 7 tests **PASS**

- [ ] **Step 3: Commit**

```
git add src/hooks/usePushHistory.ts src/test/usePushHistory.test.ts
git commit -m "feat: add usePushHistory hook with localStorage persistence"
```

---

## Task 3: Update PushPage to use the hook and render history list

**Files:**
- Modify: `src/pages/PushPage.tsx`

- [ ] **Step 1: Replace PushPage.tsx with the updated version**

The changes vs the current file:
- Remove `STORAGE_KEY`, `LastSent`, `loadLast`, `saveLast`
- Remove `last` state and the "Last sent" card JSX
- Add `useRef` import
- Add `usePushHistory` import and call
- Add `titleRef` ref wired to the Title `<Input>`
- Replace the old `reuse()` function with one that takes an `entry` param and calls `titleRef.current?.focus()`
- Call `addEntry(title, body, uid)` in `onSuccess` (replaces `saveLast` + `setLast`)
- Add history section below the send form
- Remove placeholder props (`placeholder={last?.title}`, etc.) from form fields

Full file content:

```tsx
// src/pages/PushPage.tsx
import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sendPush, extractErrorMessage } from '../api/push';
import { usePushHistory, type HistoryEntry } from '../hooks/usePushHistory';

export default function PushPage() {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [uid, setUid] = useState(() => searchParams.get('uid') ?? '');
  const titleRef = useRef<HTMLInputElement>(null);
  const { history, addEntry } = usePushHistory();

  const { mutate, isPending } = useMutation({
    mutationFn: () => sendPush(title, body, uid || undefined),
    onSuccess: (data) => {
      toast.success(`Sent! Message ID: ${data.messageId}`);
      addEntry(title, body, uid);
      setTitle(''); setBody(''); setUid('');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutate(); };

  const reuse = (entry: HistoryEntry) => {
    setTitle(entry.title);
    setBody(entry.body);
    setUid(entry.uid);
    titleRef.current?.focus();
  };

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Push Notification</h1>

      <Card>
        <CardHeader><CardTitle>Send Notification</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="uid">UID (optional)</Label>
              <Input
                id="uid"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Leave empty to send to all users"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Sending…' : 'Send notification'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications sent yet.</p>
        ) : (
          history.map((entry, i) => (
            <Card key={i}>
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 text-sm min-w-0">
                    <p className="text-muted-foreground">
                      {new Date(entry.sentAt).toLocaleString()}
                      {' · '}
                      {entry.uid ? `uid: ${entry.uid.slice(0, 16)}…` : 'All users'}
                    </p>
                    <p className="font-medium truncate">{entry.title}</p>
                    <p className="text-muted-foreground truncate">{entry.body}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => reuse(entry)} className="shrink-0">
                    Re-use
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Run all tests**

```
npx vitest run
```

Expected: all tests pass

- [ ] **Step 4: Smoke test in browser**

Start dev server: `npm run dev`

1. Open `http://localhost:5173/push`
2. Verify the "Last sent" card is gone
3. Verify "History — No notifications sent yet." appears below the form
4. Send a test notification (backend must be running)
5. Verify a history row appears with correct timestamp, target, title, body
6. Click Re-use — verify form is pre-filled and Title input is focused
7. Send again with different title — verify it appears at the top, old entry moves down
8. Hard-refresh the page — verify history survives (loaded from localStorage)

- [ ] **Step 5: Commit**

```
git add src/pages/PushPage.tsx
git commit -m "feat: replace last-sent card with full push notification history"
```

---

## Self-Review

**Spec coverage:**
- ✅ localStorage only
- ✅ 50 entry cap (Task 2, `MAX = 50`, capped via `.slice(0, MAX)`)
- ✅ Re-use pre-fills form (Task 3, `reuse(entry)`)
- ✅ Re-use focuses Title field (`titleRef.current?.focus()`)
- ✅ Same page below the form (history section after the send `<Card>`)
- ✅ Empty state ("No notifications sent yet.")
- ✅ Old `loadLast`/`saveLast`/`last` removed
- ✅ localStorage write errors silently ignored (`persist()` try-catch)

**Placeholder scan:** None found.

**Type consistency:** `HistoryEntry` defined once in `usePushHistory.ts`, imported as a type in `PushPage.tsx`. `addEntry(title, body, uid)` signature is consistent across hook definition, test calls, and PushPage usage.
