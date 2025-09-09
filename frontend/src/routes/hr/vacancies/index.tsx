import { createFileRoute } from '@tanstack/react-router';
import { Vacancies } from '@/components/hr/Vacancies';

export const Route = createFileRoute('/hr/vacancies/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Vacancies />;
}
