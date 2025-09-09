import Update from '@/components/hr/Update';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hr/vacancies/$id/update')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Update />;
}
