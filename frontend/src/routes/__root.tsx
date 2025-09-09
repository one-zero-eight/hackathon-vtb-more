import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanstackDevtools } from '@tanstack/react-devtools';

import Header from '../components/Header';
import { AuthProvider } from '../contexts/AuthContext';

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

import type { QueryClient } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/toast-1';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const location = window.location.pathname;
    const isAuthPage = location.startsWith('/auth');

    return (
      <AuthProvider>
        <Header />
        <ToastProvider>
          <main className={isAuthPage ? '' : 'pt-16'}>
            <Outlet />
          </main>
        </ToastProvider>
        {import.meta.env.VITE_MODE !== 'production' && (
          <TanstackDevtools
            config={{ position: 'bottom-left' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        )}
      </AuthProvider>
    );
  },
});
