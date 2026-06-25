import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import type { UserDto } from '../types';

interface Props {
  user: UserDto;
  onBan: (uid: string) => void;
  onUnban: (uid: string) => void;
  onDelete: (uid: string) => void;
}

export default function UserActions({ user, onBan, onUnban, onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.status === 'banned' ? (
          <DropdownMenuItem onClick={() => onUnban(user.uid)}>Unban</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onBan(user.uid)}>Ban</DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(user.uid)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}