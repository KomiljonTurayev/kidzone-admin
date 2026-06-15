import { useQuery } from '@tanstack/react-query';
import { dailyStats, topGames } from '../api/stats';

export const useDailyStats = (from: string, to: string) =>
  useQuery({
    queryKey: ['stats', 'daily', from, to],
    queryFn: () => dailyStats(from, to),
    enabled: !!from && !!to,
  });

export const useTopGames = () =>
  useQuery({ queryKey: ['stats', 'games'], queryFn: topGames });
