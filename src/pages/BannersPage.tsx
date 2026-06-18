import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBanners, useDeleteBanner } from '../hooks/useBanners';

export default function BannersPage() {
  const { data: banners, isLoading, error } = useBanners();
  const { mutate: deleteBanner } = useDeleteBanner();

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-destructive">Failed to load banners.</p>;

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Delete banner "${title}"?`)) return;
    deleteBanner(id, {
      onSuccess: () => toast.success('Banner deleted'),
      onError: () => toast.error('Failed to delete banner'),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Banners</h1>
        <Button asChild>
          <Link to="/banners/new">New Banner</Link>
        </Button>
      </div>

      {banners?.length === 0 ? (
        <p className="text-muted-foreground">No banners yet.</p>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Target</th>
                <th className="px-4 py-3 text-left font-medium">Active</th>
                <th className="px-4 py-3 text-left font-medium">Start</th>
                <th className="px-4 py-3 text-left font-medium">End</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners?.map((b) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">{b.order}</td>
                  <td className="px-4 py-3 font-medium">{b.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {b.targetAgeGroup ?? 'All'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={b.active ? 'default' : 'secondary'}>
                      {b.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {b.startDate.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {b.endDate.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/banners/${b.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(b.id, b.title)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
