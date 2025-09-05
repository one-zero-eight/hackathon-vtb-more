import VacancyDetail from '@/components/vacancies/VacancyDetail';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/vacancy/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <VacancyDetail />;
}
