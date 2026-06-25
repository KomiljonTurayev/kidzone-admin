import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { UserDto } from '../types';
import { useDeleteUser, useBanUser, useUnbanUser } from '../hooks/useUsers';
import UserActions from './UserActions';
import DeleteUserDialog from './DeleteUserDialog';

interface Props {
  users: UserDto[];
}

export default function UserTable({ users }: Props) {
  const navigate = useNavigate();
  const [deleteUid, setDeleteUid] = useState<string | null>(null);
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: banUser } = useBanUser();
  const { mutate: unbanUser } = useUnbanUser();

  const handleDelete = () => {
    if (!deleteUid) return;
    deleteUser(deleteUid, {
      onSuccess: () => toast.success('User deleted'),
      onError: () => toast.error('Failed to delete user'),
      onSettled: () => setDeleteUid(null),
    });
  };

  const handleBan = (uid: string) => {
    banUser(uid, {
      onSuccess: () => toast.success('User banned'),
      onError: () => toast.error('Failed to ban user'),
    });
  };

  const handleUnban = (uid: string) => {
    unbanUser(uid, {
      onSuccess: () => toast.success('User unbanned'),
      onError: () => toast.error('Failed to unban user'),
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age Group</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.uid} className="cursor-pointer" onClick={() => navigate(`/users/${u.uid}`)}>
              <TableCell>{u.displayName || '—'}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.ageGroup}</TableCell>
              <TableCell>
                <Badge variant={u.status === 'active' ? 'default' : 'destructive'}>{u.status}</Badge>
              </TableCell>
              <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <UserActions user={u} onBan={handleBan} onUnban={handleUnban} onDelete={setDeleteUid} />
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DeleteUserDialog
        open={!!deleteUid}
        onOpenChange={(open) => !open && setDeleteUid(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}