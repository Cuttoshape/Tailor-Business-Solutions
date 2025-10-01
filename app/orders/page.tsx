'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    {
      id: '#ORD-001',
      customer: 'Sarah Johnson',
      item: 'Wedding Dress',
      status: 'In Progress',
      amount: '$450',
      date: '2024-01-15',
      deliveryDate: '2024-02-15',
      progress: 65,
      avatar: 'SJ',
      color: 'blue'
    },
    {
      id: '#ORD-002',
      customer: 'Mike Chen',
      item: 'Business Suit',
      status: 'Completed',
      amount: '$320',
      date: '2024-01-10',
      deliveryDate: '2024-01-25',
      progress: 100,
      avatar: 'MC',
      color: 'green'
    },
    {
      id: '#ORD-003',
      customer: 'Emma Davis',
      item: 'Evening Gown',
      status: 'Pending',
      amount: '$580',
      date: '2024-01-20',
      deliveryDate: '2024-03-01',
      progress: 0,
      avatar: 'ED',
      color: 'orange'
    },
    {
      id: '#ORD-004',
      customer: 'John Wilson',
      item: 'Casual Shirt',
      status: 'Measuring',
      amount: '$85',
      date: '2024-01-22',
      deliveryDate: '2024-02-05',
      progress: 25,
      avatar: 'JW',
      color: 'purple'
    }
  ];

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending':
        return orders.filter(order => order.status === 'Pending');
      case 'progress':
        return orders.filter(order => order.status === 'In Progress' || order.status === 'Measuring');
      case 'completed':
        return orders.filter(order => order.status === 'Completed');
      default:
        return orders;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Measuring':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
          <h1 className="font-semibold text-gray-800">Orders</h1>
          <Link href="/orders/new" className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <i className="ri-add-line text-white text-sm"></i>
          </Link>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* Stats Cards */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-shopping-bag-line text-blue-600 text-lg"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">24</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-green-600 text-lg"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">$2,450</p>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="bg-gray-100 rounded-full p-1 flex mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                activeTab === 'all' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                activeTab === 'pending' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                activeTab === 'progress' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                activeTab === 'completed' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Done
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="px-4 space-y-3">
          {getFilteredOrders().map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              onClick={() => {
                setSelectedOrder(order);
                setShowOrderDetails(true);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${order.color}-100 rounded-full flex items-center justify-center`}>
                    <span className={`text-sm font-medium text-${order.color}-600`}>{order.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.id}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="mb-3">
                <p className="font-medium text-gray-800 mb-1">{order.item}</p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Delivery: {order.deliveryDate}</span>
                  <span className="font-semibold text-indigo-600">{order.amount}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{order.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/orders/new" className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <i className="ri-add-line text-indigo-600 text-sm"></i>
                </div>
                <span className="text-sm font-medium text-indigo-800">New Order</span>
              </Link>
              
              <button className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-file-download-line text-green-600 text-sm"></i>
                </div>
                <span className="text-sm font-medium text-green-800">Export Orders</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">Order Details</h3>
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-${selectedOrder.color}-100 rounded-full flex items-center justify-center`}>
                  <span className={`text-lg font-semibold text-${selectedOrder.color}-600`}>{selectedOrder.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedOrder.customer}</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.id}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-800 mb-3">Order Information</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Item</p>
                    <p className="font-medium text-gray-800">{selectedOrder.item}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-semibold text-indigo-600">{selectedOrder.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-800">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Delivery Date</p>
                    <p className="font-medium text-gray-800">{selectedOrder.deliveryDate}</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800">Progress</h5>
                  <span className="text-sm font-medium text-gray-600">{selectedOrder.progress}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedOrder.progress}%` }}
                  ></div>
                </div>
                
                {/* Progress Steps */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-white text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-700">Measurements taken</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-white text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-700">Design confirmed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">Cutting in progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Sewing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Final fitting</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium">
                  Update Status
                </button>
                <button className="flex-1 py-3 border border-gray-200 rounded-lg font-medium text-gray-600">
                  Contact Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-2">
        <div className="grid grid-cols-5 gap-1">
          <Link href="/" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-home-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </Link>
          
          <Link href="/measurements" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-ruler-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Measure</span>
          </Link>
          
          <Link href="/orders" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-shopping-bag-line text-indigo-600 text-lg"></i>
            </div>
            <span className="text-xs text-indigo-600 font-medium mt-1">Orders</span>
          </Link>
          
          <Link href="/customers" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-group-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Customers</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-user-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}