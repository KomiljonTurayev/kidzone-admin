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

type Target = 'all' | 'single';

export default function PushPage() {
  const [searchParams] = useSearchParams();
  const initialUid = searchParams.get('uid') ?? '';
  const [target, setTarget] = useState<Target>(initialUid ? 'single' : 'all');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [uid, setUid] = useState(initialUid);
  const titleRef = useRef<HTMLInputElement>(null);
  const { history, addEntry } = usePushHistory();

  const { mutate, isPending } = useMutation({
    mutationFn: () => sendPush(title, body, target === 'single' ? uid || undefined : undefined),
    onSuccess: (data) => {
      toast.success(`Sent! Message ID: ${data.messageId}`);
      addEntry(title, body, target === 'single' ? uid : '');
      setTitle(''); setBody(''); setUid('');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutate(); };

  const reuse = (entry: HistoryEntry) => {
    setTitle(entry.title);
    setBody(entry.body);
    if (entry.uid) {
      setTarget('single');
      setUid(entry.uid);
    } else {
      setTarget('all');
      setUid('');
    }
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
              <Label>Recipients</Label>
              <div className="flex rounded-md border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTarget('all')}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    target === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All users
                </button>
                <button
                  type="button"
                  onClick={() => setTarget('single')}
                  className={`flex-1 py-2 text-sm font-medium transition-colors border-l ${
                    target === 'single'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Specific user
                </button>
              </div>
            </div>

            {target === 'single' && (
              <div className="space-y-1">
                <Label htmlFor="uid">User UID</Label>
                <Input
                  id="uid"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="Enter user UID"
                  required
                />
              </div>
            )}

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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? 'Sending…'
                : target === 'all'
                  ? 'Send to all users'
                  : 'Send to user'}
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
