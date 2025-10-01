'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import apiClient from '@/lib/api';

interface OrderTrendsProps {
  period: string;
}

export default function OrderTrends({ period }: OrderTrendsProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await apiClient.analytics.getOrderTrends({
          startDate: getStartDate(period),
          endDate: new Date().toISOString()
        });

        const trends = result.trends || [];
        const statusMap: any = {};

        trends.forEach((item: any) => {
          statusMap[item.status] = parseInt(item.count);
        });

        const formattedData = [
          {
            name: 'Orders',
            orders: Object.values(statusMap).reduce((a: any, b: any) => a + b, 0),
            completed: statusMap['completed'] || 0
          }
        ];

        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch order trends:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const getStartDate = (period: string): string => {
    const now = new Date();
    switch (period) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '30d':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case '90d':
        return new Date(now.setDate(now.getDate() - 90)).toISOString();
      case '1y':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Trends</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Orders</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>
      </div>

      <div className="h-48">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
