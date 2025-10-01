
'use client';

interface TopProductsProps {
  period: string;
}

export default function TopProducts({ period }: TopProductsProps) {
  const getProducts = (period: string) => {
    const products = {
      '7d': [
        { name: 'Wedding Dress', orders: 4, revenue: 200000, percentage: 33 },
        { name: 'Business Suit', orders: 3, revenue: 150000, percentage: 25 },
        { name: 'Evening Gown', orders: 2, revenue: 100000, percentage: 17 },
        { name: 'Casual Shirt', orders: 3, revenue: 35000, percentage: 25 }
      ],
      '30d': [
        { name: 'Wedding Dress', orders: 16, revenue: 800000, percentage: 33 },
        { name: 'Business Suit', orders: 12, revenue: 600000, percentage: 25 },
        { name: 'Evening Gown', orders: 8, revenue: 400000, percentage: 17 },
        { name: 'Casual Shirt', orders: 12, revenue: 150000, percentage: 25 }
      ],
      '90d': [
        { name: 'Wedding Dress', orders: 48, revenue: 2400000, percentage: 33 },
        { name: 'Business Suit', orders: 36, revenue: 1800000, percentage: 25 },
        { name: 'Evening Gown', orders: 24, revenue: 1200000, percentage: 17 },
        { name: 'Casual Shirt', orders: 36, revenue: 450000, percentage: 25 }
      ],
      '1y': [
        { name: 'Wedding Dress', orders: 192, revenue: 9600000, percentage: 33 },
        { name: 'Business Suit', orders: 144, revenue: 7200000, percentage: 25 },
        { name: 'Evening Gown', orders: 96, revenue: 4800000, percentage: 17 },
        { name: 'Casual Shirt', orders: 144, revenue: 1800000, percentage: 25 }
      ]
    };
    return products[period as keyof typeof products];
  };

  const products = getProducts(period);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        <button className="text-teal-600 text-sm font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.orders} orders</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">₦{product.revenue.toLocaleString()}</p>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${product.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{product.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
