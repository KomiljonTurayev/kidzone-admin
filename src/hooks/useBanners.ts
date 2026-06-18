import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listBanners, getBanner, createBanner, updateBanner, deleteBanner } from '../api/banners';
import type { BannerRequest } from '../types';

export const useBanners = () =>
  useQuery({ queryKey: ['banners'], queryFn: listBanners });

export const useBanner = (id: string) =>
  useQuery({ queryKey: ['banners', id], queryFn: () => getBanner(id), enabled: !!id });

export const useCreateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BannerRequest) => createBanner(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });
};

export const useUpdateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BannerRequest }) => updateBanner(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });
};

export const useDeleteBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });
};
