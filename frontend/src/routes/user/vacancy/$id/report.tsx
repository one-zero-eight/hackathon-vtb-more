import { createFileRoute } from '@tanstack/react-router';
import { VacancyReport } from '@/components/vacancies/VacancyReport';

export const Route = createFileRoute('/user/vacancy/$id/report')({
  component: VacancyReport,
});
