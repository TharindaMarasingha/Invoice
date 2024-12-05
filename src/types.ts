export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
  unit?: string;
  thumbnail?: string;
}

export interface BusinessDetails {
  name: string;
  address: string;
  logo?: string;
}

export interface Client {
  id: string;
  name: string;
  business: BusinessDetails;
}

export interface Invoice {
  id: string;
  number: string;
  date: Date;
  dueDate?: Date;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  total: number;
  billedBy: BusinessDetails;
  billedTo?: Client;
  shippingDetails?: string;
}