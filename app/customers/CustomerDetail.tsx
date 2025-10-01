
'use client';

import { useState } from 'react';

interface CustomerDetailProps {
  customer: any;
  onClose: () => void;
}

export default function CustomerDetail({ customer, onClose }: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState('profile');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      item: 'Wedding Dress',
      status: 'Completed',
      amount: 150000,
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      item: 'Business Suit',
      status: 'In Progress',
      amount: 85000,
      date: '2024-01-10'
    },
    {
      id: 'ORD-003',
      item: 'Evening Gown',
      status: 'Measuring',
      amount: 120000,
      date: '2024-01-08'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Customer Header */}
          <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50">
            <div className="flex items-center space-x-4">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                <p className="text-gray-600">{customer.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">
                    <i className="ri-phone-line mr-1"></i>
                    {customer.phone}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'vip' ? 'bg-purple-100 text-purple-700' :
                    customer.status === 'active' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {customer.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{customer.totalOrders}</div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(customer.totalSpent)}</div>
              <div className="text-xs text-gray-500">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor((new Date().getTime() - new Date(customer.joinDate).getTime()) / (1000 * 60 * 60 * 24))}d
              </div>
              <div className="text-xs text-gray-500">Customer Since</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'profile', label: 'Profile', icon: 'ri-user-line' },
                { key: 'measurements', label: 'Measurements', icon: 'ri-ruler-line' },
                { key: 'orders', label: 'Orders', icon: 'ri-shopping-bag-line' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                    activeTab === tab.key
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="ri-mail-line text-blue-600 text-sm"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.email}</div>
                        <div className="text-xs text-gray-500">Email Address</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="ri-phone-line text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.phone}</div>
                        <div className="text-xs text-gray-500">Phone Number</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i className="ri-map-pin-line text-purple-600 text-sm"></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.address}</div>
                        <div className="text-xs text-gray-500">Address</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2">
                    <i className="ri-phone-line"></i>
                    <span>Call</span>
                  </button>
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2">
                    <i className="ri-whatsapp-line"></i>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'measurements' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Body Measurements</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(customer.measurements).map(([key, value]) => (
                      <div key={key} className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {key}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {String(value)}{key === 'height' ? 'cm' : '"'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-information-line text-blue-600"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-900">Last Updated</div>
                      <div className="text-xs text-blue-600">January 10, 2024</div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium">
                  Update Measurements
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">{order.item}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{order.id}</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(order.amount)}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}

                <button className="w-full bg-teal-500 text-white py-3 rounded-xl font-medium mt-4">
                  View All Orders
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
