import Applicants from '@/components/applicants/Applicants';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hr/vacancies/$id/applicants')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Applicants />;
}
