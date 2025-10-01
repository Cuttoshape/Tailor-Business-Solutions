'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

interface CustomerInsightsProps {
  period: string;
}

export default function CustomerInsights({ period }: CustomerInsightsProps) {
  const [insights, setInsights] = useState({
    activeCustomers: 0,
    newCustomersThisMonth: 0,
    avgOrderValue: 0
  });
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [insightsData, customersData]: any = await Promise.all([
          apiClient.analytics.getCustomerInsights(),
          apiClient.analytics.getTopCustomers(1)
        ]);

        setInsights({
          activeCustomers: insightsData.activeCustomers || 0,
          newCustomersThisMonth: insightsData.newCustomersThisMonth || 0,
          avgOrderValue: insightsData.avgOrderValue || 0
        });

        setTopCustomers(customersData.topCustomers || []);
      } catch (error) {
        console.error('Failed to fetch customer insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const topCustomer = topCustomers[0];
  const retention = insights.activeCustomers > 0
    ? Math.round((insights.activeCustomers / (insights.activeCustomers + insights.newCustomersThisMonth)) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Customer Insights</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <i className="ri-user-add-line text-lg text-blue-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : insights.newCustomersThisMonth}
              </p>
              <p className="text-sm text-gray-600">New This Month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <i className="ri-user-heart-line text-lg text-green-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : insights.activeCustomers}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : topCustomer ? (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Top Customer</h4>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">VIP</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {topCustomer.name?.charAt(0).toUpperCase() || 'C'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{topCustomer.name}</p>
              <p className="text-sm text-gray-600">Total Spent: ${parseFloat(topCustomer.totalSpent).toLocaleString()}</p>
            </div>
            <button className="w-8 h-8 flex items-center justify-center text-teal-600">
              <i className="ri-arrow-right-line text-lg"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-center py-8">
          <p className="text-gray-500">No customer data available</p>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Customer Retention</h4>
          <span className="text-lg font-bold text-gray-900">{retention}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${retention}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {retention > 60 ? 'Great retention rate! Keep up the excellent service.' : 'Focus on improving customer retention.'}
        </p>
      </div>
    </div>
  );
}
