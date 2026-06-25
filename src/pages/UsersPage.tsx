import { useState } from 'react';
import UserTable from '../components/UserTable';
import { useUsers } from '../hooks/useUsers';
import PaginationControls from '../components/PaginationControls';
import QueryStateWrapper from '../components/QueryStateWrapper';

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useUsers(page);

  const totalPages = data ? Math.ceil(data.total / data.size) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      <QueryStateWrapper
        isLoading={isLoading}
        error={error}
        errorMessagePrefix="Failed to load users"
      >
        <UserTable users={data?.users ?? []} />
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalItems={data?.total ?? 0}
          itemName="users"
          onPageChange={setPage}
        />
      </QueryStateWrapper>
    </div>
  );
}