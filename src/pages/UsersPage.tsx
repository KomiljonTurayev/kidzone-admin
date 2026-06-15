import { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserTable from '../components/UserTable';
import { useUsers } from '../hooks/useUsers';

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useUsers(page);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-destructive">Failed to load users.</p>;

  const totalPages = data ? Math.ceil(data.total / data.size) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      <UserTable users={data?.users ?? []} />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{data?.total ?? 0} total users</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="px-2">Page {page + 1} of {totalPages || 1}</span>
          <Button variant="outline" size="sm" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
