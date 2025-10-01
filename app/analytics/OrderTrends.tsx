
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface OrderTrendsProps {
  period: string;
}

export default function OrderTrends({ period }: OrderTrendsProps) {
  const getData = (period: string) => {
    const data = {
      '7d': [
        { name: 'Mon', orders: 2, completed: 1 },
        { name: 'Tue', orders: 1, completed: 1 },
        { name: 'Wed', orders: 3, completed: 2 },
        { name: 'Thu', orders: 2, completed: 2 },
        { name: 'Fri', orders: 2, completed: 1 },
        { name: 'Sat', orders: 1, completed: 1 },
        { name: 'Sun', orders: 1, completed: 0 }
      ],
      '30d': [
        { name: 'Week 1', orders: 8, completed: 6 },
        { name: 'Week 2', orders: 12, completed: 10 },
        { name: 'Week 3', orders: 15, completed: 12 },
        { name: 'Week 4', orders: 13, completed: 11 }
      ],
      '90d': [
        { name: 'Month 1', orders: 48, completed: 39 },
        { name: 'Month 2', orders: 46, completed: 38 },
        { name: 'Month 3', orders: 50, completed: 42 }
      ],
      '1y': [
        { name: 'Q1', orders: 144, completed: 119 },
        { name: 'Q2', orders: 152, completed: 128 },
        { name: 'Q3', orders: 148, completed: 125 },
        { name: 'Q4', orders: 132, completed: 110 }
      ]
    };
    return data[period as keyof typeof data];
  };

  const data = getData(period);

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
      </div>
    </div>
  );
}
