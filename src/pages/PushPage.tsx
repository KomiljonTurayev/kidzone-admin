import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sendPush, extractErrorMessage } from '../api/push';
import { usePushHistory, type HistoryEntry } from '../hooks/usePushHistory';

export default function PushPage() {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [uid, setUid] = useState(() => searchParams.get('uid') ?? '');
  const titleRef = useRef<HTMLInputElement>(null);
  const { history, addEntry } = usePushHistory();

  const { mutate, isPending } = useMutation({
    mutationFn: () => sendPush(title, body, uid || undefined),
    onSuccess: (data) => {
      toast.success(`Sent! Message ID: ${data.messageId}`);
      addEntry(title, body, uid);
      setTitle(''); setBody(''); setUid('');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutate(); };

  const reuse = (entry: HistoryEntry) => {
    setTitle(entry.title);
    setBody(entry.body);
    setUid(entry.uid);
    titleRef.current?.focus();
  };

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Push Notification</h1>

      <Card>
        <CardHeader><CardTitle>Send Notification</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={3}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="uid">UID (optional)</Label>
              <Input
                id="uid"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Leave empty to send to all users"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Sending…' : 'Send notification'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications sent yet.</p>
        ) : (
          history.map((entry, i) => (
            <Card key={i}>
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 text-sm min-w-0">
                    <p className="text-muted-foreground">
                      {new Date(entry.sentAt).toLocaleString()}
                      {' · '}
                      {entry.uid ? `uid: ${entry.uid.slice(0, 16)}…` : 'All users'}
                    </p>
                    <p className="font-medium truncate">{entry.title}</p>
                    <p className="text-muted-foreground truncate">{entry.body}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => reuse(entry)} className="shrink-0">
                    Re-use
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
