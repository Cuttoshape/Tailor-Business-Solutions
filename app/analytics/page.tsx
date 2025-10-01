
'use client';

import { useState } from 'react';
import SalesOverview from './SalesOverview';
import RevenueChart from './RevenueChart';
import TopProducts from './TopProducts';
import CustomerInsights from './CustomerInsights';
import OrderTrends from './OrderTrends';
import PeriodSelector from './PeriodSelector';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [showSalesForm, setShowSalesForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Sales Analytics</h1>
            <p className="text-sm text-gray-600">Track your business performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSalesForm(true)}
              className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center"
            >
              <i className="ri-add-line text-white text-lg"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center">
              <i className="ri-download-line text-lg text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 mt-16">
        {/* Period Selector */}
        <PeriodSelector 
          selectedPeriod={selectedPeriod} 
          onPeriodChange={setSelectedPeriod} 
        />

        {/* Sales Overview */}
        <SalesOverview period={selectedPeriod} />

        {/* Revenue Chart */}
        <RevenueChart period={selectedPeriod} />

        {/* Order Trends */}
        <OrderTrends period={selectedPeriod} />

        {/* Top Products */}
        <TopProducts period={selectedPeriod} />

        {/* Customer Insights */}
        <CustomerInsights period={selectedPeriod} />
      </div>

      {/* Manual Sales Entry Modal */}
      {showSalesForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Add Sales Entry</h2>
                <button 
                  onClick={() => setShowSalesForm(false)}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <i className="ri-close-line text-gray-600 text-lg"></i>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>

              {/* Sale Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Amount</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg">
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product/Service</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  placeholder="e.g., Wedding Dress, Business Suit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select className="w-full p-3 border border-gray-200 rounded-lg">
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg h-20"
                  placeholder="Add any additional notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowSalesForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Handle save logic here
                    setShowSalesForm(false);
                  }}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
