import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hr/vacancies/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/hr/vancacies/$id/"!</div>;
}
