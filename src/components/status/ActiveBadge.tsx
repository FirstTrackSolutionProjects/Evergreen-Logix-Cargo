import { Badge } from '@/components/ui/Badge';

interface ActiveBadgeProps {
  isActive: boolean;
}

export function ActiveBadge({ isActive }: ActiveBadgeProps) {
  return (
    <Badge variant={isActive ? 'success' : 'neutral'} dot>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}