import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import Icon from '@/components/ui/Icon';
import { createBooking, updateBooking } from '@/services/staff';
import { BookingCreate, TBooking } from '@/types/staff';
import { BookingCreate as BookingCreateSchema } from '@/types/schemas';
import { format } from 'date-fns';

interface NewOrEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: TBooking | null;
  onSuccess: () => void;
}

export function NewOrEditDialog({ open, onOpenChange, booking, onSuccess }: NewOrEditDialogProps) {
  const isEdit = !!booking;
  const form = useForm<BookingCreate>({
    resolver: zodResolver(BookingCreateSchema),
    defaultValues: {
      guestName: '',
      phone: '',
      groupSize: 2,
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      category: 'Standard',
      notes: '',
    },
  });

  useEffect(() => {
    if (booking) {
      form.reset({
        guestName: booking.guestName,
        phone: booking.phone,
        groupSize: booking.groupSize,
        date: booking.date,
        time: booking.time,
        category: booking.category,
        tableId: booking.tableId || undefined,
        notes: booking.notes || '',
      });
    } else {
      form.reset({
        guestName: '',
        phone: '',
        groupSize: 2,
        date: new Date().toISOString().split('T')[0],
        time: '20:00',
        category: 'Standard',
        notes: '',
      });
    }
  }, [booking, form]);

  const onSubmit = async (data: BookingCreate) => {
    try {
      if (isEdit && booking) {
        await updateBooking(booking.id, {
          guestName: data.guestName,
          phone: data.phone,
          groupSize: data.groupSize,
          date: data.date,
          time: data.time,
          category: data.category,
          tableId: data.tableId || null,
          notes: data.notes,
        });
        toast.success('Booking updated successfully');
      } else {
        await createBooking(data);
        toast.success('Booking created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast.error(isEdit ? 'Failed to update booking' : 'Failed to create booking');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Booking' : 'New Booking'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update booking information' : 'Create a new booking'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" aria-invalid={!!form.formState.errors.guestName} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1-555-0100" aria-invalid={!!form.formState.errors.phone} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="groupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Size *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        aria-invalid={!!form.formState.errors.groupSize}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-start">
                            {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                            <Icon name="calendar" size={16} className="ml-auto" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} aria-invalid={!!form.formState.errors.time} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table ID (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="T01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Additional notes..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

