'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

interface SalesOverviewProps {
  period: string;
}

export default function SalesOverview({ period }: SalesOverviewProps) {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: any = await apiClient.analytics.getDashboard();
        setMetrics({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          totalCustomers: data.totalCustomers || 0,
          pendingOrders: data.pendingOrders || 0
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const avgOrder = metrics.totalOrders > 0 ? metrics.totalRevenue / metrics.totalOrders : 0;

  const cards = [
    {
      title: 'Total Revenue',
      value: loading ? '...' : `$${metrics.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: 'ri-money-dollar-circle-line',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Orders',
      value: loading ? '...' : metrics.totalOrders.toString(),
      change: '+8.2%',
      icon: 'ri-shopping-bag-line',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Customers',
      value: loading ? '...' : metrics.totalCustomers.toString(),
      change: '+15.3%',
      icon: 'ri-user-add-line',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Order Value',
      value: loading ? '...' : `$${avgOrder.toFixed(2)}`,
      change: '+5.7%',
      icon: 'ri-bar-chart-line',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.bgColor} rounded-full flex items-center justify-center`}>
                <i className={`${card.icon} text-lg ${card.color}`}></i>
              </div>
              <span className="text-xs text-green-600 font-medium">{card.change}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
