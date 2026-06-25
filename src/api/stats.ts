import api from './axios';
import type { DailyStatsDto, GameStatsDto } from '../types';

export const dailyStats = (from: string, to: string) =>
  api.get<DailyStatsDto[]>('/admin/stats/daily', { params: { from, to } });

export const topGames = () =>
  api.get<GameStatsDto[]>('/admin/stats/games');