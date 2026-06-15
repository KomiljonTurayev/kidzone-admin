import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import type { UserDto } from '../types';
import { useDeleteUser, useBanUser } from '../hooks/useUsers';

interface Props {
  users: UserDto[];
}

export default function UserTable({ users }: Props) {
  const navigate = useNavigate();
  const [deleteUid, setDeleteUid] = useState<string | null>(null);
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: banUser } = useBanUser();

  const handleDelete = () => {
    if (!deleteUid) return;
    deleteUser(deleteUid, {
      onSuccess: () => toast.success('User deleted'),
      onError: () => toast.error('Failed to delete user'),
    });
    setDeleteUid(null);
  };

  const handleBan = (uid: string) => {
    banUser(uid, {
      onSuccess: () => toast.success('User banned'),
      onError: () => toast.error('Failed to ban user'),
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={u.status === 'banned'} onClick={() => handleBan(u.uid)}>Ban</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteUid(u.uid)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No users found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteUid} onOpenChange={(open) => !open && setDeleteUid(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>This permanently deletes the user from Firebase Auth and Firestore.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
