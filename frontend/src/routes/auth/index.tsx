import { createFileRoute } from '@tanstack/react-router';
import { SignInPage } from '@/components/ui/sign-in';

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background text-foreground">
      <SignInPage />
    </div>
  );
}
