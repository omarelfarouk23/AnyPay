// src/hooks/useCustomerService.ts
import { create } from 'zustand';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: number;
  updatedAt: number;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: number;
}

interface CustomerServiceState {
  tickets: Ticket[];
  activeTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
}

interface CustomerServiceActions {
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  setActiveTicket: (ticket: Ticket | null) => void;
  addMessage: (ticketId: string, message: TicketMessage) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCustomerServiceStore = create<CustomerServiceState & CustomerServiceActions>(
  (set) => ({
    tickets: [],
    activeTicket: null,
    isLoading: false,
    error: null,

    setTickets: (tickets) => set({ tickets }),
    addTicket: (ticket) =>
      set((state) => ({ tickets: [ticket, ...state.tickets] })),
    updateTicket: (id, updates) =>
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
        activeTicket:
          state.activeTicket?.id === id
            ? { ...state.activeTicket, ...updates }
            : state.activeTicket,
      })),
    setActiveTicket: (ticket) => set({ activeTicket: ticket }),
    addMessage: (ticketId, message) =>
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                messages: [...t.messages, message],
                updatedAt: Date.now(),
              }
            : t
        ),
        activeTicket:
          state.activeTicket?.id === ticketId
            ? {
                ...state.activeTicket,
                messages: [...state.activeTicket.messages, message],
              }
            : state.activeTicket,
      })),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),
  })
);
