import { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-bg-dark text-text-high">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar venueName="AURA Nightclub" />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
