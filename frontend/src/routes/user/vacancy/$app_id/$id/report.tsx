import Report from '@/components/user/Report';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/vacancy/$app_id/$id/report')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Report />;
}
