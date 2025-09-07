import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hr/vacancies/create')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/hr/vancacies/create"!</div>;
}
