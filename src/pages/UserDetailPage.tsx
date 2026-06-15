import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useUser, useDeleteUser, useBanUser } from '../hooks/useUsers';

export default function UserDetailPage() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(uid!);
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: banUser } = useBanUser();
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (error || !user) return <p className="text-destructive">User not found.</p>;

  const handleDelete = () => {
    deleteUser(uid!, {
      onSuccess: () => { toast.success('User deleted'); navigate('/users'); },
      onError: () => toast.error('Failed to delete user'),
    });
  };

  const handleBan = () => {
    banUser(uid!, {
      onSuccess: () => toast.success('User banned'),
      onError: () => toast.error('Failed to ban user'),
    });
  };

  const fields: [string, React.ReactNode][] = [
    ['UID', user.uid],
    ['Email', user.email],
    ['Age group', user.ageGroup],
    ['Status', <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>{user.status}</Badge>],
    ['FCM token', user.fcmToken || '—'],
    ['Created at', user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'],
    ['Last active', user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : '—'],
  ];

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}><ArrowLeft className="h-4 w-4" /></Button>
        <h1 className="text-2xl font-semibold">User Detail</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" disabled={user.status === 'banned'} onClick={handleBan}>Ban user</Button>
        <Button variant="destructive" onClick={() => setShowDelete(true)}>Delete user</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>{user.displayName || '(no name)'}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {fields.map(([label, value]) => (
            <div key={label as string} className="flex gap-2">
              <span className="w-28 text-muted-foreground shrink-0">{label}</span>
              <span className="break-all">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
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
    </div>
  );
}
