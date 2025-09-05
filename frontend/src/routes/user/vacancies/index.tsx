import Vacancies from '../../../components/vacancies/Vacancies';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user/vacancies/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Vacancies />;
}
