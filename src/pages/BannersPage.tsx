import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useBanners, useDeleteBanner } from '../hooks/useBanners';
import QueryStateWrapper from '../components/QueryStateWrapper';
import BannersTable from '../components/BannersTable';
import DeleteBannerDialog from '../components/DeleteBannerDialog';

type BannerToDelete = {
  id: string;
  title: string;
};

export default function BannersPage() {
  const [toDelete, setToDelete] = useState<BannerToDelete | null>(null);
  const { data: banners, isLoading, error } = useBanners();
  const { mutate: deleteBanner } = useDeleteBanner();

  const handleDeleteConfirm = () => {
    if (!toDelete) return;
    deleteBanner(toDelete.id, {
      onSuccess: () => toast.success('Banner deleted'),
      onError: () => toast.error('Failed to delete banner'),
      onSettled: () => setToDelete(null),
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Banners</h1>
          <Button asChild>
            <Link to="/banners/new">New Banner</Link>
          </Button>
        </div>

        <QueryStateWrapper
          isLoading={isLoading}
          error={error}
          errorMessagePrefix="Failed to load banners"
        >
          <BannersTable
            banners={banners ?? []}
            onDelete={(id, title) => setToDelete({ id, title })}
          />
        </QueryStateWrapper>
      </div>

      <DeleteBannerDialog
        open={!!toDelete}
        bannerTitle={toDelete?.title}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}