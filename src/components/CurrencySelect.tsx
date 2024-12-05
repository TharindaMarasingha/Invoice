import React from 'react';
import { useInvoiceStore } from '../store/useInvoiceStore';

const currencies = [
  { code: 'LKR', symbol: 'Rs' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'INR', symbol: '₹' }
];

export default function CurrencySelect() {
  const { currentInvoice, setCurrency } = useInvoiceStore();

  return (
    <select
      value={currentInvoice.currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
    >
      {currencies.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.code} ({currency.symbol})
        </option>
      ))}
    </select>
  );
}