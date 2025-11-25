import { Eye } from 'lucide-react';
import { Button } from './ui/button';

interface ViewButtonProps {
  onClick: () => void;
}

export function ViewButton({ onClick }: ViewButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 flex items-center justify-center gap-2"
    >
      <Eye className="w-4 h-4" />
      View
    </Button>
  );
}
