import { Users, Activity, Clock, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyStats, useTopGames } from '../hooks/useStats';
import { useUsers } from '../hooks/useUsers';

const today = new Date().toISOString().slice(0, 10);

export default function DashboardPage() {
  const { data: users } = useUsers(0);
  const { data: daily } = useDailyStats(today, today);
  const { data: games } = useTopGames();

  const todayStats = daily?.[0];
  const topGame = games?.[0];
  const bannedCount = users?.users.filter((u) => u.status === 'banned').length ?? 0;

  const summaryCards = [
    {
      title: 'Total Users',
      value: users?.total ?? '—',
      sub: `${bannedCount} banned`,
      icon: Users,
    },
    {
      title: "Today's DAU",
      value: todayStats?.dau ?? '—',
      sub: today,
      icon: Activity,
    },
    {
      title: 'Sessions Today',
      value: todayStats?.totalSessions ?? '—',
      sub: `${todayStats?.totalMinutes ?? 0} min total`,
      icon: Clock,
    },
    {
      title: 'Top Game',
      value: topGame?.gameName ?? '—',
      sub: topGame ? `${topGame.playCount.toLocaleString()} plays` : 'No data yet',
      icon: Gamepad2,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ title, value, sub, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Top 5 Games</CardTitle></CardHeader>
          <CardContent>
            {!games?.length ? (
              <p className="text-sm text-muted-foreground">No game data yet</p>
            ) : (
              <ol className="space-y-2">
                {games.slice(0, 5).map((g, i) => (
                  <li key={g.gameId} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground w-4">{i + 1}.</span>
                      {g.gameName}
                    </span>
                    <span className="font-medium">{g.playCount.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Users</CardTitle></CardHeader>
          <CardContent>
            {!users?.users.length ? (
              <p className="text-sm text-muted-foreground">No users yet</p>
            ) : (
              <ol className="space-y-2">
                {users.users.slice(0, 5).map((u) => (
                  <li key={u.uid} className="flex items-center justify-between text-sm">
                    <span className="truncate max-w-[200px]">{u.displayName || u.email || u.uid}</span>
                    <span className={u.status === 'banned' ? 'text-destructive text-xs' : 'text-muted-foreground text-xs'}>
                      {u.status}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
