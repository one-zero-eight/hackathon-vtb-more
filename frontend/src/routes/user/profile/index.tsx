import Profile from '@/components/user/Profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Profile />;
}
