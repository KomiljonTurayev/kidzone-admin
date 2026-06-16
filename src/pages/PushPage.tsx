import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sendPush, extractErrorMessage } from '../api/push';

const STORAGE_KEY = 'push_last_sent';

interface LastSent {
  title: string;
  body: string;
  uid: string;
  sentAt: string;
}

function loadLast(): LastSent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLast(title: string, body: string, uid: string) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ title, body, uid, sentAt: new Date().toISOString() }),
  );
}

export default function PushPage() {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [uid, setUid] = useState(() => searchParams.get('uid') ?? '');
  const [last, setLast] = useState<LastSent | null>(loadLast);

  const { mutate, isPending } = useMutation({
    mutationFn: () => sendPush(title, body, uid || undefined),
    onSuccess: (data) => {
      toast.success(`Sent! Message ID: ${data.messageId}`);
      saveLast(title, body, uid);
      setLast(loadLast());
      setTitle(''); setBody(''); setUid('');
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutate(); };

  const reuse = () => {
    if (!last) return;
    setTitle(last.title);
    setBody(last.body);
    setUid(last.uid);
  };

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Push Notification</h1>

      {last && (
        <Card className="border-dashed bg-muted/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last sent · {new Date(last.sentAt).toLocaleString()}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={reuse}>
                Re-use
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><span className="font-medium">Title:</span> {last.title}</p>
            <p><span className="font-medium">Body:</span> {last.body}</p>
            <p>
              <span className="font-medium">UID:</span>{' '}
              {last.uid || <span className="text-muted-foreground">all users</span>}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Send Notification</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={last?.title}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={last?.body}
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
                placeholder={last?.uid || 'Leave empty to send to all users'}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Sending…' : 'Send notification'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
