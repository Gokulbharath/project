import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import Icon from '@/components/ui/Icon';
import { listTickets, createTicket } from '@/services/staff';
import { TicketDialog } from './TicketDialog';
import { formatTimeAgo } from '@/utils/format';

type Ticket = {
  id: string;
  subject: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
};

const faqs = [
  {
    id: '1',
    question: 'How do I handle a payment mismatch?',
    answer: 'Contact the guest and verify the payment amount. If there is a discrepancy, update the booking payment status and add notes.',
  },
  {
    id: '2',
    question: 'What should I do if a QR code is not scanning?',
    answer: 'Check if the QR code is properly displayed. If the issue persists, manually verify the booking code and mark the guest as arrived.',
  },
  {
    id: '3',
    question: 'How do I report a bug?',
    answer: 'Use the "Report Bug" quick action or submit a support ticket with details about the issue you encountered.',
  },
  {
    id: '4',
    question: 'Can I cancel a booking after payment?',
    answer: 'Yes, you can cancel bookings. If payment has been received, you may need to process a refund through your payment processor.',
  },
];

export default function SupportIndex() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleQuickAction = (subject: string, category: string, severity: 'LOW' | 'MEDIUM' | 'HIGH') => {
    // Pre-fill dialog with quick action data
    setDialogOpen(true);
  };

  const handleTicketCreated = () => {
    loadTickets();
    setDialogOpen(false);
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (ticketSearch) {
      const query = ticketSearch.toLowerCase();
      return (
        ticket.subject.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      return ticket.status === statusFilter;
    }
    return true;
  });

  const columns: Column<Ticket>[] = [
    {
      id: 'subject',
      header: 'Subject',
      accessor: (row) => <span className="font-medium">{row.subject}</span>,
    },
    {
      id: 'category',
      header: 'Category',
      accessor: (row) => <span className="text-text-dim">{row.category}</span>,
    },
    {
      id: 'severity',
      header: 'Severity',
      accessor: (row) => (
        <span
          className={`text-xs px-2 py-1 rounded ${
            row.severity === 'HIGH'
              ? 'bg-red/20 text-red'
              : row.severity === 'MEDIUM'
              ? 'bg-yellow/20 text-yellow'
              : 'bg-blue/20 text-blue'
          }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => (
        <span
          className={`text-xs px-2 py-1 rounded ${
            row.status === 'RESOLVED'
              ? 'bg-green/20 text-green'
              : row.status === 'IN_PROGRESS'
              ? 'bg-blue/20 text-blue'
              : 'bg-yellow/20 text-yellow'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Last Update',
      accessor: (row) => <span className="text-text-dim text-sm">{formatTimeAgo(row.updatedAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        subtitle="Get help and submit support tickets"
        right={
          <Button onClick={() => setDialogOpen(true)} aria-label="Submit Ticket">
            <Icon name="plus" size={16} className="mr-2" />
            Submit Ticket
          </Button>
        }
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleQuickAction('Payment mismatch', 'Payments', 'MEDIUM')}
        >
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="dollar-sign" size={20} />
              Payment Mismatch
            </CardTitle>
            <CardDescription>Report payment discrepancies</CardDescription>
          </CardHeader>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleQuickAction('QR issue', 'Technical', 'HIGH')}
        >
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="qr-code" size={20} />
              QR Issue
            </CardTitle>
            <CardDescription>QR code scanning problems</CardDescription>
          </CardHeader>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleQuickAction('Report bug', 'Technical', 'LOW')}
        >
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon name="bug" size={20} />
              Report Bug
            </CardTitle>
            <CardDescription>Report software issues</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search FAQs..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs
              .filter((faq) =>
                faqSearch
                  ? faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
                  : true
              )
              .map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and manage your support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search tickets..."
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <LoadingState rows={3} />
          ) : error ? (
            <ErrorState message={error} onRetry={loadTickets} />
          ) : filteredTickets.length === 0 ? (
            <EmptyState
              icon="inbox"
              title="No tickets found"
              description="Submit a ticket to get help"
            />
          ) : (
            <DataTable data={filteredTickets} columns={columns} />
          )}
        </CardContent>
      </Card>

      <TicketDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={handleTicketCreated} />
    </div>
  );
}

