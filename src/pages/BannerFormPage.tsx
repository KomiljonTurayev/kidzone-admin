import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useBanner, useCreateBanner, useUpdateBanner } from '../hooks/useBanners';
import type { BannerRequest } from '../types';

const AGE_GROUPS = ['3-5', '6-8', '9-12'];

const toIsoStart = (d: string) => new Date(`${d}T00:00:00`).toISOString();
const toIsoEnd = (d: string) => new Date(`${d}T23:59:59`).toISOString();
const toDateInput = (iso: string) => iso.slice(0, 10);

export default function BannerFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existing, isLoading } = useBanner(id ?? '');
  const { mutate: createBanner, isPending: creating } = useCreateBanner();
  const { mutate: updateBanner, isPending: updating } = useUpdateBanner();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [targetAgeGroup, setTargetAgeGroup] = useState('');
  const [active, setActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setImageUrl(existing.imageUrl);
      setLink(existing.link);
      setTargetAgeGroup(existing.targetAgeGroup ?? '');
      setActive(existing.active);
      setStartDate(toDateInput(existing.startDate));
      setEndDate(toDateInput(existing.endDate));
      setOrder(existing.order);
    }
  }, [existing]);

  if (isEdit && isLoading) return <p className="text-muted-foreground">Loading…</p>;

  const buildRequest = (): BannerRequest => ({
    title,
    description,
    imageUrl,
    link,
    targetAgeGroup: targetAgeGroup || null,
    active,
    startDate: toIsoStart(startDate),
    endDate: toIsoEnd(endDate),
    order,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (endDate < startDate) {
      toast.error('End date must be after start date');
      return;
    }
    const data = buildRequest();
    if (isEdit) {
      updateBanner({ id: id!, data }, {
        onSuccess: () => { toast.success('Banner updated'); navigate('/banners'); },
        onError: () => toast.error('Failed to update banner'),
      });
    } else {
      createBanner(data, {
        onSuccess: () => { toast.success('Banner created'); navigate('/banners'); },
        onError: () => toast.error('Failed to create banner'),
      });
    }
  };

  const isPending = creating || updating;

  return (
    <div className="max-w-lg space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/banners')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Banner' : 'New Banner'}</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>{isEdit ? 'Edit Banner' : 'Create Banner'}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="link">Link</Label>
              <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="targetAgeGroup">Target Age Group</Label>
              <select
                id="targetAgeGroup"
                value={targetAgeGroup}
                onChange={(e) => setTargetAgeGroup(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">All users</option>
                {AGE_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} required />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Banner'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
