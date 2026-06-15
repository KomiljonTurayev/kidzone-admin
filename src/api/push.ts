import api from './axios';
import type { PushResponse } from '../types';

export const sendPush = (title: string, body: string, uid?: string) =>
  api
    .post<PushResponse>('/admin/push/send', { title, body, uid: uid || undefined })
    .then((r) => r.data);
