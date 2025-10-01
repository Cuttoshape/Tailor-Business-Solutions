
'use client';

import { useState } from 'react';
import InvoiceGenerator from './InvoiceGenerator';

const invoicesData = [
  {
    id: 'INV-2024-001',
    customer: 'Adunni Adebayo',
    email: 'adunni@email.com',
    amount: 85000,
    currency: 'NGN',
    status: 'Paid',
    date: '2024-02-15',
    dueDate: '2024-03-01',
    items: [
      { name: 'Wedding Dress', quantity: 1, price: 75000 },
      { name: 'Veil', quantity: 1, price: 10000 }
    ]
  },
  {
    id: 'INV-2024-002',
    customer: 'Chika Okonkwo',
    email: 'chika@email.com',
    amount: 45000,
    currency: 'NGN',
    status: 'Sent',
    date: '2024-02-14',
    dueDate: '2024-02-28',
    items: [
      { name: 'Business Suit', quantity: 1, price: 45000 }
    ]
  },
  {
    id: 'INV-2024-003',
    customer: 'Fatima Ibrahim',
    email: 'fatima@email.com',
    amount: 65000,
    currency: 'NGN',
    status: 'Draft',
    date: '2024-02-13',
    dueDate: '2024-02-27',
    items: [
      { name: 'Evening Gown', quantity: 1, price: 55000 },
      { name: 'Clutch Bag', quantity: 1, price: 10000 }
    ]
  },
  {
    id: 'INV-2024-004',
    customer: 'Emeka Nwankwo',
    email: 'emeka@email.com',
    amount: 25000,
    currency: 'NGN',
    status: 'Paid',
    date: '2024-02-12',
    dueDate: '2024-02-26',
    items: [
      { name: 'Casual Shirt', quantity: 2, price: 12500 }
    ]
  }
];

export default function Invoices() {
  const [activeTab, setActiveTab] = useState('All');
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const tabs = ['All', 'Draft', 'Sent', 'Paid'];
  
  const filteredInvoices = activeTab === 'All' 
    ? invoicesData 
    : invoicesData.filter(invoice => invoice.status === activeTab);

  const totalRevenue = invoicesData
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (showGenerator) {
    return (
      <InvoiceGenerator
        onClose={() => setShowGenerator(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Invoices</h1>
            <button
              onClick={() => {
                setSelectedInvoice(null);
                setShowGenerator(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-1"></i>
              New Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-20 px-4">
        {/* Stats */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{invoicesData.length}</p>
              <p className="text-sm text-gray-600">Total Invoices</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {invoicesData.filter(inv => inv.status === 'Sent').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Invoice List */}
        <div className="space-y-3">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">{invoice.id}</p>
                  <p className="text-sm text-gray-600">{invoice.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900" suppressHydrationWarning={true}>
                    {formatDate(invoice.date)}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </p>
                  <p className="text-sm text-gray-600" suppressHydrationWarning={true}>
                    Due: {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowGenerator(true);
                    }}
                    className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                  <button className="p-2 text-green-600 bg-green-50 rounded-lg">
                    <i className="ri-share-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
