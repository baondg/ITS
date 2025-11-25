import { Edit2 } from 'lucide-react';
import { Button } from './ui/button';

interface EditButtonProps {
  onClick: () => void;
}

export function EditButton({ onClick }: EditButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="flex-1 h-10"
    >
      <Edit2 className="w-4 h-4 mr-2" />
      Edit
    </Button>
  );
}
