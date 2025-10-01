
'use client';

interface SalesOverviewProps {
  period: string;
}

export default function SalesOverview({ period }: SalesOverviewProps) {
  const getMetrics = (period: string) => {
    const metrics = {
      '7d': {
        revenue: 485000,
        orders: 12,
        customers: 8,
        avgOrder: 40417
      },
      '30d': {
        revenue: 1950000,
        orders: 48,
        customers: 32,
        avgOrder: 40625
      },
      '90d': {
        revenue: 5850000,
        orders: 144,
        customers: 96,
        avgOrder: 40625
      },
      '1y': {
        revenue: 23400000,
        orders: 576,
        customers: 384,
        avgOrder: 40625
      }
    };
    return metrics[period as keyof typeof metrics];
  };

  const metrics = getMetrics(period);

  const cards = [
    {
      title: 'Total Revenue',
      value: `₦${metrics.revenue.toLocaleString()}`,
      change: '+12.5%',
      icon: 'ri-money-dollar-circle-line',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Orders',
      value: metrics.orders.toString(),
      change: '+8.2%',
      icon: 'ri-shopping-bag-line',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'New Customers',
      value: metrics.customers.toString(),
      change: '+15.3%',
      icon: 'ri-user-add-line',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Order Value',
      value: `₦${metrics.avgOrder.toLocaleString()}`,
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
