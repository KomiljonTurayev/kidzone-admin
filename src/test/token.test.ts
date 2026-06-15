import { describe, it, expect, beforeEach } from 'vitest';
import { getToken, setToken, clearToken } from '../lib/token';

describe('token', () => {
  beforeEach(() => localStorage.clear());

  it('returns null when no token stored', () => {
    expect(getToken()).toBeNull();
  });

  it('stores and retrieves token', () => {
    setToken('abc123');
    expect(getToken()).toBe('abc123');
  });

  it('clears stored token', () => {
    setToken('abc123');
    clearToken();
    expect(getToken()).toBeNull();
  });
});
