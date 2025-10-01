'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import apiClient from '@/lib/api';

interface RevenueChartProps {
  period: string;
}

export default function RevenueChart({ period }: RevenueChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await apiClient.analytics.getRevenue({
          period,
          startDate: getStartDate(period),
          endDate: new Date().toISOString()
        });

        const formattedData = (result.analytics || []).map((item: any) => ({
          name: formatDate(item.date),
          revenue: parseFloat(item.revenue) || 0
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Revenue</span>
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
            <LineChart data={data}>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: '#14b8a6', r: 4 }}
                activeDot={{ r: 6, fill: '#14b8a6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
