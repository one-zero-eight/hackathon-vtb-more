import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AdminRoute } from '@/components/AdminRoute';

export const Route = createFileRoute('/hr/__layout')({
  beforeLoad: async () => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/auth' });
    }

    try {
      // Make a request to check user status
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        throw redirect({ to: '/auth' });
      }

      const user = await response.json();
      if (!user.is_admin) {
        throw redirect({ to: '/' });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('redirect')) {
        throw error;
      }
      localStorage.removeItem('token');
      throw redirect({ to: '/auth' });
    }
  },
  component: HRLayout,
});

function HRLayout() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    </AdminRoute>
  );
}
