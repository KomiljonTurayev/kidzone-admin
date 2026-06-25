import api from './axios';
import type { PagedUsersDto, UserDto } from '../types';

export const listUsers = (page: number, size = 20) =>
  api.get<PagedUsersDto>('/admin/users', { params: { page, size } });

export const getUser = (uid: string) =>
  api.get<UserDto>(`/admin/users/${uid}`);

export const deleteUser = (uid: string) =>
  api.delete(`/admin/users/${uid}`);

export const banUser = (uid: string) =>
  api.post<UserDto>(`/admin/users/${uid}/ban`);

export const unbanUser = (uid: string) =>
  api.post<UserDto>(`/admin/users/${uid}/unban`);