import api from './axios';
import type { BannerDto, BannerRequest } from '../types';

export const listBanners = () =>
  api.get<BannerDto[]>('/admin/banners');

export const getBanner = (id: string) =>
  api.get<BannerDto>(`/admin/banners/${id}`);

export const createBanner = (data: BannerRequest) =>
  api.post<BannerDto>('/admin/banners', data);

export const updateBanner = (id: string, data: BannerRequest) =>
  api.put<BannerDto>(`/admin/banners/${id}`, data);

export const deleteBanner = (id: string) =>
  api.delete(`/admin/banners/${id}`);