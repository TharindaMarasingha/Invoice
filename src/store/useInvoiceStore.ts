import { create } from 'zustand';
import { Invoice, InvoiceItem, Client, BusinessDetails } from '../types';

interface InvoiceStore {
  currentInvoice: Invoice;
  companyName: string;
  footerText: string;
  setCompanyName: (name: string) => void;
  setFooterText: (text: string) => void;
  setInvoiceNumber: (number: string) => void;
  setInvoiceDate: (date: Date) => void;
  setDueDate: (date?: Date) => void;
  setCurrency: (currency: string) => void;
  setBilledBy: (details: BusinessDetails) => void;
  setBilledTo: (client?: Client) => void;
  addItem: (item: InvoiceItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<InvoiceItem>) => void;
  setShippingDetails: (details?: string) => void;
  setTax: (tax?: number) => void;
}

const initialInvoice: Invoice = {
  id: crypto.randomUUID(),
  number: '001',
  date: new Date(),
  currency: 'LKR',
  items: [],
  subtotal: 0,
  total: 0,
  billedBy: {
    name: '',
    address: ''
  }
};

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  currentInvoice: initialInvoice,
  companyName: 'Project Name',
  footerText: 'For any enquiry, reach out via xxxx@gmail.com, call on +xx xx xxx xxxx',
  setCompanyName: (name) => set({ companyName: name }),
  setFooterText: (text) => set({ footerText: text }),
  setInvoiceNumber: (number) =>
    set((state) => ({ currentInvoice: { ...state.currentInvoice, number } })),
  setInvoiceDate: (date) =>
    set((state) => ({ currentInvoice: { ...state.currentInvoice, date } })),
  setDueDate: (dueDate) =>
    set((state) => ({ currentInvoice: { ...state.currentInvoice, dueDate } })),
  setCurrency: (currency) =>
    set((state) => ({ currentInvoice: { ...state.currentInvoice, currency } })),
  setBilledBy: (billedBy) =>
    set((state) => ({ currentInvoice: { ...state.currentInvoice, billedBy } })),
  setBilledTo: (billedTo) =>
    set((state) => ({ currentInvoice: { ...state.currentInvoice, billedTo } })),
  addItem: (item) =>
    set((state) => ({
      currentInvoice: {
        ...state.currentInvoice,
        items: [...state.currentInvoice.items, item],
        subtotal: state.currentInvoice.subtotal + item.amount,
        total: state.currentInvoice.subtotal + item.amount + (state.currentInvoice.tax || 0)
      }
    })),
  removeItem: (id) =>
    set((state) => {
      const item = state.currentInvoice.items.find((i) => i.id === id);
      const newItems = state.currentInvoice.items.filter((i) => i.id !== id);
      const newSubtotal = state.currentInvoice.subtotal - (item?.amount || 0);
      return {
        currentInvoice: {
          ...state.currentInvoice,
          items: newItems,
          subtotal: newSubtotal,
          total: newSubtotal + (state.currentInvoice.tax || 0)
        }
      };
    }),
  updateItem: (id, updatedItem) =>
    set((state) => {
      const newItems = state.currentInvoice.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      );
      const newSubtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
      return {
        currentInvoice: {
          ...state.currentInvoice,
          items: newItems,
          subtotal: newSubtotal,
          total: newSubtotal + (state.currentInvoice.tax || 0)
        }
      };
    }),
  setShippingDetails: (shippingDetails) =>
    set((state) => ({ currentInvoice: { ...state.currentInvoice, shippingDetails } })),
  setTax: (tax) =>
    set((state) => ({
      currentInvoice: {
        ...state.currentInvoice,
        tax,
        total: state.currentInvoice.subtotal + (tax || 0)
      }
    }))
}));