
'use client';

interface CustomerInsightsProps {
  period: string;
}

export default function CustomerInsights({ period }: CustomerInsightsProps) {
  const getInsights = (period: string) => {
    const insights = {
      '7d': {
        newCustomers: 3,
        returningCustomers: 5,
        topCustomer: { name: 'Adunni Ade', spent: 125000 },
        retention: 62
      },
      '30d': {
        newCustomers: 12,
        returningCustomers: 20,
        topCustomer: { name: 'Adunni Ade', spent: 500000 },
        retention: 62
      },
      '90d': {
        newCustomers: 36,
        returningCustomers: 60,
        topCustomer: { name: 'Adunni Ade', spent: 1500000 },
        retention: 62
      },
      '1y': {
        newCustomers: 144,
        returningCustomers: 240,
        topCustomer: { name: 'Adunni Ade', spent: 6000000 },
        retention: 62
      }
    };
    return insights[period as keyof typeof insights];
  };

  const insights = getInsights(period);

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
              <p className="text-2xl font-bold text-gray-900">{insights.newCustomers}</p>
              <p className="text-sm text-gray-600">New Customers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <i className="ri-user-heart-line text-lg text-green-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{insights.returningCustomers}</p>
              <p className="text-sm text-gray-600">Returning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Top Customer</h4>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">VIP</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <img 
            src="https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20elegant%20business%20attire%2C%20confident%20smile%2C%20studio%20lighting%2C%20clean%20background%2C%20professional%20headshot%20photography%20style&width=60&height=60&seq=customer1&orientation=squarish"
            alt={insights.topCustomer.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{insights.topCustomer.name}</p>
            <p className="text-sm text-gray-600">Total Spent: ₦{insights.topCustomer.spent.toLocaleString()}</p>
          </div>
          <button className="w-8 h-8 flex items-center justify-center text-teal-600">
            <i className="ri-arrow-right-line text-lg"></i>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Customer Retention</h4>
          <span className="text-lg font-bold text-gray-900">{insights.retention}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${insights.retention}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Great retention rate! Keep up the excellent service.
        </p>
      </div>
    </div>
  );
}
