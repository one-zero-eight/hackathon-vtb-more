import VoiceChat from '@/components/interview/VoiceChat';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/interview/$applicationId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <VoiceChat />;
}
