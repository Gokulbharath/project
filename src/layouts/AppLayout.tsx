import { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

interface AppLayoutProps {
  children?: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-bg-dark text-text-high">
      <aside className="relative z-40">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="relative z-30">
          <Topbar venueName="AURA Nightclub" />
        </header>

        <main className="flex-1 overflow-auto relative z-0 isolate">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {children ?? <Outlet key={location.pathname} />}
          </div>
        </main>
      </div>

    </div>
  );
};
