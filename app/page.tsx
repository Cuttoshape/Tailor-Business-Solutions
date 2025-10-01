
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="font-sans text-xl text-indigo-600" style={{ fontFamily: 'Calibri, sans-serif' }}>Cuttoshape</h1>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <i className="ri-user-line text-white text-sm"></i>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-20 px-4 pb-8">
        <div className="text-center mb-8">
          <img 
            src="https://readdy.ai/api/search-image?query=Professional%20tailor%20working%20with%20measuring-tape%20and%20fabric%2C%20modern%20tailoring%20workshop%2C%20clean%20bright%20lighting%2C%20professional%20photography%20style%2C%20high%20quality%20details%2C%20centered%20composition&width=300&height=200&seq=hero1&orientation=landscape"
            alt="Tailor Hero"
            className="w-full h-48 object-cover rounded-2xl mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Fashion Designer Business Solutions</h2>
          <p className="text-gray-600 text-sm leading-relaxed">Complete solution for managing measurements, orders, invoices, and customer relationships</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/measurements" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <img 
                src="https://readdy.ai/api/search-image?query=icon%2C%20measuring%20tape%20icon%2C%203D%20cartoon%20style%2C%20vibrant%20blue%20color%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20clean%20modern%20look&width=48&height=48&seq=measure1&orientation=squarish"
                alt="Measurements"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Body Measurements</h3>
            <p className="text-xs text-gray-500 mt-1">Auto & Manual entry</p>
          </Link>

          <Link href="/costing" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <img 
                src="https://readdy.ai/api/search-image?query=icon%2C%20calculator%20with%20money%20symbol%2C%203D%20cartoon%20style%2C%20vibrant%20green%20color%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20clean%20modern%20look&width=48&height=48&seq=cost1&orientation=squarish"
                alt="Costing"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Cost Calculator</h3>
            <p className="text-xs text-gray-500 mt-1">Price & profit margins</p>
          </Link>

          <Link href="/invoices" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <img 
                src="https://readdy.ai/api/search-image?query=icon%2C%20invoice%20document%20with%20pen%2C%203D%20cartoon%20style%2C%20vibrant%20purple%20color%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20clean%20modern%20look&width=48&height=48&seq=invoice1&orientation=squarish"
                alt="Invoices"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Proforma Invoice</h3>
            <p className="text-xs text-gray-500 mt-1">Email & WhatsApp</p>
          </Link>

          <Link href="/analytics" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
              <img 
                src="https://readdy.ai/api/search-image?query=icon%2C%20analytics%20chart%20with%20trending%20arrow%2C%203D%20cartoon%20style%2C%20vibrant%20orange%20color%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20clean%20modern%20look&width=48&height=48&seq=analytics1&orientation=squarish"
                alt="Analytics"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Sales Analytics</h3>
            <p className="text-xs text-gray-500 mt-1">Historical data & trends</p>
          </Link>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Choose Your Plan</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <h4 className="font-medium text-blue-800">Basic Plan</h4>
                <p className="text-xs text-blue-600">Up to 50 customers</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-800">$29/mo</p>
                <button className="text-xs text-blue-600 underline">Select</button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <div>
                <h4 className="font-medium text-indigo-800">Pro Plan</h4>
                <p className="text-xs text-indigo-600">Unlimited customers</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-indigo-800">$59/mo</p>
                <button className="text-xs text-indigo-600 underline">Select</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-20">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-user-add-line text-blue-600 text-xs"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">New customer: Sarah Johnson</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-file-text-line text-green-600 text-xs"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Invoice sent to Mike Chen</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-ruler-line text-purple-600 text-xs"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Measurements updated for Emma Davis</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-2">
        <div className="grid grid-cols-5 gap-1">
          <Link href="/" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-home-line text-indigo-600 text-lg"></i>
            </div>
            <span className="text-xs text-indigo-600 font-medium mt-1">Home</span>
          </Link>
          
          <Link href="/measurements" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-ruler-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Measure</span>
          </Link>
          
          <Link href="/orders" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-shopping-bag-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Orders</span>
          </Link>
          
          <Link href="/customers" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-group-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Customers</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-user-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
