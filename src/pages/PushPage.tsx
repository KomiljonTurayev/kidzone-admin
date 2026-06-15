import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sendPush } from '../api/push';

export default function PushPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [uid, setUid] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => sendPush(title, body, uid || undefined),
    onSuccess: (data) => {
      toast.success(`Sent! Message ID: ${data.messageId}`);
      setTitle(''); setBody(''); setUid('');
    },
    onError: () => toast.error('Failed to send notification'),
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mutate(); };

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Push Notification</h1>
      <Card>
        <CardHeader><CardTitle>Send Notification</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} required rows={3} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="uid">UID (optional)</Label>
              <Input id="uid" value={uid} onChange={(e) => setUid(e.target.value)} placeholder="Leave empty to send to all users" />
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
