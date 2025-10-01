
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  period: string;
}

export default function RevenueChart({ period }: RevenueChartProps) {
  const getData = (period: string) => {
    const data = {
      '7d': [
        { name: 'Mon', revenue: 65000 },
        { name: 'Tue', revenue: 45000 },
        { name: 'Wed', revenue: 85000 },
        { name: 'Thu', revenue: 72000 },
        { name: 'Fri', revenue: 95000 },
        { name: 'Sat', revenue: 68000 },
        { name: 'Sun', revenue: 55000 }
      ],
      '30d': [
        { name: 'Week 1', revenue: 320000 },
        { name: 'Week 2', revenue: 480000 },
        { name: 'Week 3', revenue: 520000 },
        { name: 'Week 4', revenue: 630000 }
      ],
      '90d': [
        { name: 'Month 1', revenue: 1950000 },
        { name: 'Month 2', revenue: 1850000 },
        { name: 'Month 3', revenue: 2050000 }
      ],
      '1y': [
        { name: 'Q1', revenue: 5850000 },
        { name: 'Q2', revenue: 6200000 },
        { name: 'Q3', revenue: 5950000 },
        { name: 'Q4', revenue: 5400000 }
      ]
    };
    return data[period as keyof typeof data];
  };

  const data = getData(period);

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
              tickFormatter={(value) => `₦${(value / 1000)}k`}
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
      </div>
    </div>
  );
}
