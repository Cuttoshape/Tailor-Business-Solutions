
'use client';

import { useState } from 'react';
import Link from 'next/link';
import CustomerList from './CustomerList';
import CustomerDetail from './CustomerDetail';
import CustomerStats from './CustomerStats';

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="w-8 h-8 flex items-center justify-center">
                <i className="ri-arrow-left-line text-xl text-gray-700"></i>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-search-line text-xl text-gray-600"></i>
              </button>
              <Link href="/customers/add" className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-full">
                <i className="ri-add-line text-lg text-white"></i>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'vip', label: 'VIP' },
              { key: 'new', label: 'New' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === tab.key
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-44">
        <CustomerStats />
        <CustomerList 
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          onSelectCustomer={setSelectedCustomer}
        />
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetail 
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
