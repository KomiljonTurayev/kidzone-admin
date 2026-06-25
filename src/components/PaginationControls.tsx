import { Button } from '@/components/ui/button';

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemName?: string;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemName = 'items',
  onPageChange,
}: Props) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{totalItems} total {itemName}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="px-2">
          Page {currentPage + 1} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage + 1 >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}