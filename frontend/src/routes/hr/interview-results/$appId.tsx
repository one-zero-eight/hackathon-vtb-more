import InterviewResults from '@/components/hr/InterviewResults';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/hr/interview-results/$appId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <InterviewResults />;
}
