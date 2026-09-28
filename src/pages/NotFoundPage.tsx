import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES } from '@/constants/routes';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <EmptyState
        title="404 — Page not found"
        description="The page you are looking for doesn't exist or has been moved."
        action={
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="primary" leftIcon={<Home size={16} />}>
              Back to Dashboard
            </Button>
          </Link>
        }
      />
    </div>
  );
}