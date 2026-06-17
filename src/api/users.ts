import api from './axios';
import type { PagedUsersDto, UserDto } from '../types';

export const listUsers = (page: number, size = 20) =>
  api.get<PagedUsersDto>('/admin/users', { params: { page, size } }).then((r) => r.data);

export const getUser = (uid: string) =>
  api.get<UserDto>(`/admin/users/${uid}`).then((r) => r.data);

export const deleteUser = (uid: string) =>
  api.delete(`/admin/users/${uid}`);

export const banUser = (uid: string) =>
  api.post<UserDto>(`/admin/users/${uid}/ban`).then((r) => r.data);

export const unbanUser = (uid: string) =>
  api.post<UserDto>(`/admin/users/${uid}/unban`).then((r) => r.data);
