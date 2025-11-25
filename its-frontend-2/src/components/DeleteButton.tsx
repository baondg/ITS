import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-10 px-3"
      aria-label="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
