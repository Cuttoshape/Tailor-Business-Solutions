
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

interface TopProductsProps {
  period: string;
}

export default function TopProducts({ period }: TopProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await apiClient.analytics.getTopProducts(5);
        const topProducts = result.topProducts || [];

        const maxRevenue = Math.max(...topProducts.map((p: any) => parseFloat(p.totalRevenue)));

        const formattedProducts = topProducts.map((product: any) => ({
          name: product.productName,
          orders: parseInt(product.totalQuantity),
          revenue: parseFloat(product.totalRevenue),
          percentage: maxRevenue > 0 ? Math.round((parseFloat(product.totalRevenue) / maxRevenue) * 100) : 0
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Failed to fetch top products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        <button className="text-teal-600 text-sm font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">No products data available</p>
          </div>
        ) : (
          products.map((product, index) => (
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
        )))}
      </div>
    </div>
  );
}
