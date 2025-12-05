import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import { toast } from 'sonner';
import { Mail, Lock } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'staff' | 'admin'>('staff');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.auth.login(email, password);
      
      // Check if user role matches selected role for demo
      if (role === 'admin' && result.user.role !== 'admin') {
        toast.error('Please use admin@nightscene.com for admin access');
        setLoading(false);
        return;
      }

      login(result.user);
      toast.success(`Welcome, ${result.user.name}!`);
      
      // Navigate based on user role
      const redirectPath = result.user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.STAFF_DASHBOARD;
      navigate(redirectPath);
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Tabs value={role} onValueChange={(value) => setRole(value as 'staff' | 'admin')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
          <TabsTrigger value="staff">Staff Login</TabsTrigger>
          <TabsTrigger value="admin">Admin Login</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Staff Portal</h2>
              <p className="text-sm text-muted-foreground">Manage tables, bookings, and arrivals</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="staff-email"
                    type="email"
                    placeholder="staff@nightscene.com or any email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus:border-neon-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff-password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="staff-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus:border-neon-primary/50"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-neon-primary hover:bg-neon-primary/80 shadow-neon-md"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login as Staff'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: Use any email/password combination
            </p>
          </form>
        </TabsContent>

        <TabsContent value="admin">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
              <p className="text-sm text-muted-foreground">Business intelligence and venue management</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@nightscene.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus:border-neon-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus:border-neon-primary/50"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-neon-accent hover:bg-neon-accent/80 shadow-neon-md"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: Use admin@nightscene.com or any email
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};
