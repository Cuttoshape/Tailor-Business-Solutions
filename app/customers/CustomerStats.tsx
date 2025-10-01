
'use client';

export default function CustomerStats() {
  const stats = [
    {
      label: 'Total Customers',
      value: '248',
      change: '+12%',
      icon: 'ri-user-line',
      color: 'bg-blue-500'
    },
    {
      label: 'Active Orders',
      value: '42',
      change: '+8%',
      icon: 'ri-shopping-bag-line',
      color: 'bg-teal-500'
    },
    {
      label: 'VIP Customers',
      value: '18',
      change: '+3%',
      icon: 'ri-vip-crown-line',
      color: 'bg-purple-500'
    },
    {
      label: 'This Month',
      value: '₦2.4M',
      change: '+15%',
      icon: 'ri-money-dollar-circle-line',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} text-white text-sm`}></i>
              </div>
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
