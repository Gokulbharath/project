import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/services/api';
import { toast } from 'sonner';
import type { VenueOnboarding } from '@/types';
import { Building2, Clock, Award } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/utils/constants';

export const Onboarding = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VenueOnboarding>({
    venueName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    openingHours: '18:00',
    closingHours: '02:00',
    tableCategories: ['VIP', 'Premium', 'Standard'],
    subscriptionPlan: 'basic',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.venue.onboard(formData);
      toast.success('Venue onboarded successfully');
    } catch (error) {
      toast.error('Failed to onboard venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Venue Onboarding</h1>
        <p className="text-muted-foreground">Set up your venue profile and preferences</p>
      </div>

      <Card className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-neon-primary mb-4">
              <Building2 className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Venue Information</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                placeholder="The Night Club"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  placeholder="10001"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-neon-accent mb-4">
              <Clock className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Operating Hours</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openingHours">Opening Time</Label>
                <Input
                  id="openingHours"
                  type="time"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingHours">Closing Time</Label>
                <Input
                  id="closingHours"
                  type="time"
                  value={formData.closingHours}
                  onChange={(e) => setFormData({ ...formData, closingHours: e.target.value })}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-neon-success mb-4">
              <Award className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Subscription Plan</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Select Plan</Label>
              <Select
                value={formData.subscriptionPlan}
                onValueChange={(value) => setFormData({ ...formData, subscriptionPlan: value as any })}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <SelectItem key={plan} value={plan} className="capitalize">
                      {plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-neon-primary hover:bg-neon-primary/80 shadow-neon-md"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Onboarding'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
