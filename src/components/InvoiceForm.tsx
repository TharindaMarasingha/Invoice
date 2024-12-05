import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, FileDown, Menu, X } from 'lucide-react';
import { useInvoiceStore } from '../store/useInvoiceStore';
import { InvoiceItem } from '../types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import CurrencySelect from './CurrencySelect';

export default function InvoiceForm() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const invoice = useInvoiceStore((state) => state.currentInvoice);
  const companyName = useInvoiceStore((state) => state.companyName);
  const footerText = useInvoiceStore((state) => state.footerText);
  const {
    setCompanyName,
    setFooterText,
    setInvoiceNumber,
    setInvoiceDate,
    setDueDate,
    setBilledBy,
    setBilledTo,
    addItem,
    removeItem,
    updateItem,
    setTax
  } = useInvoiceStore();

  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    name: '',
    description: '',
    quantity: 1,
    rate: 0
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name && newItem.quantity && newItem.rate) {
      addItem({
        id: crypto.randomUUID(),
        name: newItem.name,
        description: newItem.description || '',
        quantity: newItem.quantity,
        rate: newItem.rate,
        amount: newItem.quantity * newItem.rate
      });
      setNewItem({ name: '', description: '', quantity: 1, rate: 0 });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddItem(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Mobile Menu Button */}
        <div className="md:hidden p-4 flex justify-between items-center border-b">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-purple-600 hover:text-purple-800"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="text-lg font-semibold text-purple-600">Invoice Generator</div>
        </div>

        <div className={`p-4 md:p-6 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="mb-8">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-2xl md:text-3xl font-bold text-center w-full mb-2 text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-md px-2"
              placeholder="Company Name"
            />
            <p className="text-center text-gray-600 text-sm md:text-base">Add invoice details and download it in PDF format.</p>
            <p className="text-center text-gray-600 text-sm md:text-base">Website Developed by - Tharinda Marasingha</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoice.number}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input
                type="date"
                value={format(invoice.date, 'yyyy-MM-dd')}
                onChange={(e) => setInvoiceDate(new Date(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <CurrencySelect />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 p-4 md:p-6 rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-4">Billed By</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={invoice.billedBy.name}
                    onChange={(e) => setBilledBy({ ...invoice.billedBy, name: e.target.value })}
                    placeholder="Your Name/Company"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <textarea
                    value={invoice.billedBy.address}
                    onChange={(e) => setBilledBy({ ...invoice.billedBy, address: e.target.value })}
                    placeholder="Your Address"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 md:p-6 rounded-lg">
              <h3 className="text-lg md:text-xl font-semibold text-purple-600 mb-4">Billed To</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={invoice.billedTo?.name || ''}
                    onChange={(e) => setBilledTo({
                      id: invoice.billedTo?.id || crypto.randomUUID(),
                      name: e.target.value,
                      business: invoice.billedTo?.business || { name: '', address: '' }
                    })}
                    placeholder="Client Name"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <textarea
                    value={invoice.billedTo?.business.address || ''}
                    onChange={(e) => setBilledTo({
                      ...invoice.billedTo!,
                      business: { ...invoice.billedTo!.business, address: e.target.value }
                    })}
                    placeholder="Client Address"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="min-w-[768px]">
              <div className="bg-purple-600 text-white p-3 grid grid-cols-12 gap-4 rounded-t-lg">
                <div className="col-span-3">Item</div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Rate</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1"></div>
              </div>

              {invoice.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-3 border-b">
                  <div className="col-span-3">
                    <input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Description"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, {
                          quantity: Number(e.target.value),
                          amount: Number(e.target.value) * item.rate
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.id, {
                          rate: Number(e.target.value),
                          amount: item.quantity * Number(e.target.value)
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-1">
                    <span className="p-2">{invoice.currency} {item.amount}</span>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              <form onSubmit={handleAddItem}>
                <div className="grid grid-cols-12 gap-4 p-3 border-b bg-gray-50">
                  <div className="col-span-3">
                    <input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      onKeyPress={handleKeyPress}
                      placeholder="Item name"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      onKeyPress={handleKeyPress}
                      placeholder="Description"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                      onKeyPress={handleKeyPress}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={newItem.rate}
                      onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })}
                      onKeyPress={handleKeyPress}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-1">
                    <span className="p-2">{invoice.currency} {(newItem.quantity || 0) * (newItem.rate || 0)}</span>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="submit"
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-full md:w-1/3">
              <div className="flex justify-between p-2">
                <span>Subtotal:</span>
                <span>{invoice.currency} {invoice.subtotal}</span>
              </div>
              <div className="flex justify-between p-2">
                <span>Tax:</span>
                <input
                  type="number"
                  value={invoice.tax || 0}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-24 p-1 border rounded-md text-right"
                />
              </div>
              <div className="flex justify-between p-2 font-bold">
                <span>Total:</span>
                <span>{invoice.currency} {invoice.total}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="w-full">
              <textarea
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full p-2 border rounded-md text-gray-600 text-sm"
                rows={2}
                placeholder="Enter footer text..."
              />
            </div>

            <div className="flex justify-center">
              <PDFDownloadLink
                document={<InvoicePDF invoice={invoice} companyName={companyName} footerText={footerText} />}
                fileName={`invoice-${invoice.number}.pdf`}
                className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                {({ loading }) => (
                  <>
                    <FileDown size={20} />
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}