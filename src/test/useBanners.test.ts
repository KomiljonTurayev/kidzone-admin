import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as bannersApi from '../api/banners';
import { useBanners, useBanner } from '../hooks/useBanners';
import type { BannerDto } from '../types';

const mockBanner: BannerDto = {
  id: 'b1',
  title: 'Test',
  description: 'Desc',
  imageUrl: 'https://img.example.com/x.png',
  link: 'https://example.com',
  targetAgeGroup: null,
  active: true,
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T23:59:59Z',
  order: 1,
  createdAt: '2026-01-01T00:00:00Z',
};

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return createElement(QueryClientProvider, { client: qc }, children);
}

describe('useBanners', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns banners from API', async () => {
    vi.spyOn(bannersApi, 'listBanners').mockResolvedValue([mockBanner]);
    const { result } = renderHook(() => useBanners(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockBanner]);
  });
});

describe('useBanner', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('fetches single banner by id', async () => {
    vi.spyOn(bannersApi, 'getBanner').mockResolvedValue(mockBanner);
    const { result } = renderHook(() => useBanner('b1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe('b1');
  });

  it('does not fetch when id is empty', () => {
    const spy = vi.spyOn(bannersApi, 'getBanner');
    renderHook(() => useBanner(''), { wrapper });
    expect(spy).not.toHaveBeenCalled();
  });
});
