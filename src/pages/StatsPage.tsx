import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDailyStats, useTopGames } from '../hooks/useStats';

const today = new Date().toISOString().slice(0, 10);
const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);

export default function StatsPage() {
  const [from, setFrom] = useState(thirtyDaysAgo);
  const [to, setTo] = useState(today);
  const [query, setQuery] = useState({ from: thirtyDaysAgo, to: today });

  const { data: daily, isLoading: loadingDaily } = useDailyStats(query.from, query.to);
  const { data: games, isLoading: loadingGames } = useTopGames();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Stats</h1>
      <Card>
        <CardHeader><CardTitle>Daily Stats</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-1">
              <Label>From</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>To</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button onClick={() => setQuery({ from, to })}>Apply</Button>
          </div>
          {loadingDaily ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={daily ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="dau" stroke="#6366f1" name="DAU" dot={false} />
                <Line type="monotone" dataKey="totalSessions" stroke="#22c55e" name="Sessions" dot={false} />
                <Line type="monotone" dataKey="totalMinutes" stroke="#f59e0b" name="Minutes" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Top Games</CardTitle></CardHeader>
        <CardContent>
          {loadingGames ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead className="text-right">Play Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(games ?? []).map((g, i) => (
                  <TableRow key={g.gameId}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{g.gameName}</TableCell>
                    <TableCell className="text-right">{g.playCount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {!games?.length && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">No game data yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
