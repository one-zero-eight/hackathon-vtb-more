import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hr/vacancies/archieve')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/hr/vancacies/archieve"!</div>;
}
