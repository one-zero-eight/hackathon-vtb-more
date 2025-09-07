import Create from '@/components/hr/Create';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hr/vacancies/create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Create />;
}
