
'use client';

interface CustomerListProps {
  searchQuery: string;
  filterStatus: string;
  onSelectCustomer: (customer: any) => void;
}

export default function CustomerList({ searchQuery, filterStatus, onSelectCustomer }: CustomerListProps) {
  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+234 801 234 5678',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20business%20attire%2C%20confident%20smile%2C%20studio%20lighting%2C%20clean%20background%2C%20high%20quality%20headshot&width=80&height=80&seq=customer1&orientation=squarish',
      status: 'vip',
      totalOrders: 12,
      totalSpent: 450000,
      lastOrder: '2024-01-15',
      measurements: {
        chest: 36,
        waist: 28,
        hips: 38,
        height: 165
      },
      address: '15 Victoria Island, Lagos',
      joinDate: '2023-03-15'
    },
    {
      id: 2,
      name: 'Michael Adebayo',
      email: 'michael.a@email.com',
      phone: '+234 802 345 6789',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20man%20portrait%2C%20business%20suit%2C%20confident%20expression%2C%20studio%20lighting%2C%20clean%20background%2C%20high%20quality%20headshot&width=80&height=80&seq=customer2&orientation=squarish',
      status: 'active',
      totalOrders: 8,
      totalSpent: 320000,
      lastOrder: '2024-01-12',
      measurements: {
        chest: 42,
        waist: 34,
        shoulders: 18,
        height: 175
      },
      address: '22 Ikeja GRA, Lagos',
      joinDate: '2023-06-20'
    },
    {
      id: 3,
      name: 'Fatima Hassan',
      email: 'fatima.h@email.com',
      phone: '+234 803 456 7890',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20elegant%20hijab%2C%20warm%20smile%2C%20studio%20lighting%2C%20clean%20background%2C%20high%20quality%20headshot&width=80&height=80&seq=customer3&orientation=squarish',
      status: 'new',
      totalOrders: 2,
      totalSpent: 85000,
      lastOrder: '2024-01-10',
      measurements: {
        chest: 34,
        waist: 26,
        hips: 36,
        height: 160
      },
      address: '8 Abuja Central, FCT',
      joinDate: '2024-01-05'
    },
    {
      id: 4,
      name: 'David Okafor',
      email: 'david.o@email.com',
      phone: '+234 804 567 8901',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20man%20portrait%2C%20casual%20shirt%2C%20friendly%20smile%2C%20studio%20lighting%2C%20clean%20background%2C%20high%20quality%20headshot&width=80&height=80&seq=customer4&orientation=squarish',
      status: 'active',
      totalOrders: 15,
      totalSpent: 680000,
      lastOrder: '2024-01-08',
      measurements: {
        chest: 40,
        waist: 32,
        shoulders: 17,
        height: 170
      },
      address: '45 Port Harcourt, Rivers',
      joinDate: '2023-01-10'
    },
    {
      id: 5,
      name: 'Aisha Bello',
      email: 'aisha.b@email.com',
      phone: '+234 805 678 9012',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20traditional%20attire%2C%20confident%20expression%2C%20studio%20lighting%2C%20clean%20background%2C%20high%20quality%20headshot&width=80&height=80&seq=customer5&orientation=squarish',
      status: 'vip',
      totalOrders: 20,
      totalSpent: 950000,
      lastOrder: '2024-01-14',
      measurements: {
        chest: 38,
        waist: 30,
        hips: 40,
        height: 168
      },
      address: '12 Kano State, Kano',
      joinDate: '2022-11-05'
    },
    {
      id: 6,
      name: 'Emmanuel Okoro',
      email: 'emmanuel.o@email.com',
      phone: '+234 806 789 0123',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20man%20portrait%2C%20polo%20shirt%2C%20warm%20smile%2C%20studio%20lighting%2C%20clean%20background%2C%20high%20quality%20headshot&width=80&height=80&seq=customer6&orientation=squarish',
      status: 'new',
      totalOrders: 1,
      totalSpent: 45000,
      lastOrder: '2024-01-16',
      measurements: {
        chest: 38,
        waist: 30,
        shoulders: 16,
        height: 172
      },
      address: '33 Enugu Urban, Enugu',
      joinDate: '2024-01-10'
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'new': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="px-4">
      <div className="space-y-3">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => onSelectCustomer(customer)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  customer.status === 'vip' ? 'bg-purple-500' :
                  customer.status === 'active' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{customer.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>{customer.email}</span>
                  <span>{customer.totalOrders} orders</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span className="flex items-center">
                      <i className="ri-phone-line mr-1"></i>
                      {customer.phone.slice(-4)}
                    </span>
                    <span className="flex items-center" suppressHydrationWarning={true}>
                      <i className="ri-calendar-line mr-1"></i>
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(customer.totalSpent)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-search-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
