import { createFileRoute } from '@tanstack/react-router';
import { VacancyReport } from '@/components/vacancies/VacancyReport';

export const Route = createFileRoute('/user/vacancy/$app_id/report')({
  component: VacancyReport,
});
