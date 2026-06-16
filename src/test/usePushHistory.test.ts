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
