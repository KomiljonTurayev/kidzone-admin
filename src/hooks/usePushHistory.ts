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
