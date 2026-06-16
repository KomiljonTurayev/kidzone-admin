import api from './axios';
import type { PushResponse } from '../types';

export const sendPush = (title: string, body: string, uid?: string) =>
  api
    .post<PushResponse>('/admin/push/send', { title, body, uid: uid || undefined })
    .then((r) => r.data);

export function extractErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const resp = (error as { response?: { data?: { message?: string } } }).response;
    if (resp?.data?.message) return resp.data.message;
    const msg = (error as { message?: string }).message;
    if (msg) return msg;
  }
  return 'Unknown error';
}
