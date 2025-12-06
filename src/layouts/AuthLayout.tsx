import { ReactNode } from 'react';
import Icon from '@/components/ui/Icon';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="sparkles" size={36} className="text-neon-primary" />
            <h1 className="text-4xl font-bold text-white">NightScene</h1>
          </div>
          <p className="text-muted-foreground">Table Management System</p>
        </div>

        <div className="glass-card p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
