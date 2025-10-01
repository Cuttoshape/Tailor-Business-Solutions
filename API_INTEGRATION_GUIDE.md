# Frontend-Backend API Integration Guide

## Overview

This guide explains how to connect all frontend components to the backend APIs. The Analytics page has been fully integrated as a reference implementation.

## API Client Configuration

**File:** `lib/api.ts`

The API client is configured to connect to `http://localhost:3001/api` by default. All API methods are organized by resource:

- `apiClient.auth.*` - Authentication
- `apiClient.customers.*` - Customer management
- `apiClient.orders.*` - Order management
- `apiClient.measurements.*` - Measurements
- `apiClient.invoices.*` - Invoice operations
- `apiClient.products.*` - Product catalog
- `apiClient.analytics.*` - Analytics & reports

## Integration Pattern

### 1. Import Required Dependencies

```typescript
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
```

### 2. Set Up State Management

```typescript
const [data, setData] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### 3. Fetch Data with useEffect

```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result: any = await apiClient.customers.getAll();
      setData(result.customers || []);
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### 4. Handle Loading & Error States

```typescript
if (loading) {
  return <div className="flex items-center justify-center py-8">
    <p className="text-gray-500">Loading...</p>
  </div>;
}

if (error) {
  return <div className="flex items-center justify-center py-8">
    <p className="text-red-500">{error}</p>
  </div>;
}

if (data.length === 0) {
  return <div className="flex items-center justify-center py-8">
    <p className="text-gray-500">No data available</p>
  </div>;
}
```

## Completed Integrations

### ✅ Analytics Page (Reference Implementation)

All analytics components are fully integrated:

1. **SalesOverview** - `apiClient.analytics.getDashboard()`
2. **RevenueChart** - `apiClient.analytics.getRevenue(params)`
3. **TopProducts** - `apiClient.analytics.getTopProducts(limit)`
4. **CustomerInsights** - `apiClient.analytics.getCustomerInsights()` + `apiClient.analytics.getTopCustomers(limit)`
5. **OrderTrends** - `apiClient.analytics.getOrderTrends(params)`

## Pending Integrations

### Customers Page

**Files to Update:**
- `app/customers/CustomerList.tsx`
- `app/customers/CustomerStats.tsx`
- `app/customers/CustomerDetail.tsx`

**API Methods:**
```typescript
// List customers with pagination & search
apiClient.customers.getAll({ page, limit, search })

// Get single customer
apiClient.customers.getOne(id)

// Get customer stats
apiClient.customers.getStats()

// Create new customer
apiClient.customers.create(data)

// Update customer
apiClient.customers.update(id, data)

// Delete customer
apiClient.customers.delete(id)
```

**Example Integration for CustomerList.tsx:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

interface CustomerListProps {
  searchQuery: string;
  filterStatus: string;
  onSelectCustomer: (customer: any) => void;
}

export default function CustomerList({ searchQuery, filterStatus, onSelectCustomer }: CustomerListProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const result: any = await apiClient.customers.getAll({
          search: searchQuery,
          page,
          limit: 20
        });

        // Filter by status on frontend if needed
        let filtered = result.customers || [];
        if (filterStatus !== 'all') {
          filtered = filtered.filter((c: any) => {
            if (filterStatus === 'vip') return c.totalSpent > 5000;
            if (filterStatus === 'active') return c.orderCount > 0;
            if (filterStatus === 'new') {
              const joinDate = new Date(c.createdAt);
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return joinDate > monthAgo;
            }
            return true;
          });
        }

        setCustomers(filtered);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [searchQuery, filterStatus, page]);

  // Rest of component...
}
```

### Orders Page

**File:** `app/orders/page.tsx`

**API Methods:**
```typescript
// List orders
apiClient.orders.getAll({ page, limit, status, customerId })

// Get single order
apiClient.orders.getOne(id)

// Get order stats
apiClient.orders.getStats()

// Create order
apiClient.orders.create(orderData)

// Update order
apiClient.orders.update(id, updates)

// Delete order
apiClient.orders.delete(id)
```

### Measurements Page

**File:** `app/measurements/page.tsx`

**API Methods:**
```typescript
// List measurements
apiClient.measurements.getAll({ customerId })

// Get single measurement
apiClient.measurements.getOne(id)

// Create measurement
apiClient.measurements.create(data)

// Update measurement
apiClient.measurements.update(id, data)

// Delete measurement
apiClient.measurements.delete(id)
```

### Invoices Page

**Files:**
- `app/invoices/page.tsx`
- `app/invoices/InvoiceGenerator.tsx`

**API Methods:**
```typescript
// List invoices
apiClient.invoices.getAll({ page, limit, status, customerId })

// Get single invoice
apiClient.invoices.getOne(id)

// Create invoice
apiClient.invoices.create(invoiceData)

// Update invoice
apiClient.invoices.update(id, updates)

// Generate PDF
apiClient.invoices.generatePDF(id)

// Send email
apiClient.invoices.sendEmail(id)

// Delete invoice
apiClient.invoices.delete(id)
```

### Costing Page

**File:** `app/costing/page.tsx`

**API Methods:**
```typescript
// Get all products with pricing
apiClient.products.getAll()

// Get product categories
apiClient.products.getCategories()

// Calculate cost estimates using product data
// (Frontend calculation with backend data)
```

## Common Patterns

### Create/Update Operations

```typescript
const handleSubmit = async (formData: any) => {
  try {
    setSubmitting(true);

    if (isEditing) {
      await apiClient.customers.update(customerId, formData);
      showToast('Customer updated successfully', 'success');
    } else {
      await apiClient.customers.create(formData);
      showToast('Customer created successfully', 'success');
    }

    // Refresh data
    fetchCustomers();
    closeModal();
  } catch (error: any) {
    showToast(error.message || 'Operation failed', 'error');
  } finally {
    setSubmitting(false);
  }
};
```

### Delete Operations

```typescript
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this item?')) {
    return;
  }

  try {
    await apiClient.customers.delete(id);
    showToast('Customer deleted successfully', 'success');
    fetchCustomers();
  } catch (error: any) {
    showToast(error.message || 'Delete failed', 'error');
  }
};
```

### Pagination

```typescript
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const fetchData = async () => {
  const result: any = await apiClient.orders.getAll({
    page,
    limit: 10
  });

  setData(result.orders || []);
  setTotalPages(result.pagination?.pages || 1);
};

// In JSX
<button onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
<span>Page {page} of {totalPages}</span>
<button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
```

## Error Handling

The API client automatically handles authentication errors and network issues. Always wrap API calls in try-catch blocks:

```typescript
try {
  const result = await apiClient.someMethod();
  // Handle success
} catch (error: any) {
  // error.message contains the error description
  console.error('API Error:', error);
  showToast(error.message, 'error');
}
```

## Authentication

Set the auth token after login:

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const result: any = await apiClient.auth.login({ email, password });
    apiClient.setToken(result.token);
    // Navigate to dashboard
  } catch (error: any) {
    showToast(error.message, 'error');
  }
};
```

Clear token on logout:

```typescript
const handleLogout = () => {
  apiClient.clearToken();
  // Navigate to login
};
```

## Next Steps

1. Update CustomerList, CustomerStats, and CustomerDetail components
2. Update Orders page to use `apiClient.orders.*`
3. Update Measurements page to use `apiClient.measurements.*`
4. Update Invoices page to use `apiClient.invoices.*`
5. Update Costing page to use `apiClient.products.*`
6. Test all CRUD operations
7. Implement proper error handling and loading states

## Testing Checklist

- [ ] Analytics dashboard loads data correctly
- [ ] Customer list displays backend data
- [ ] Create new customer works
- [ ] Update customer works
- [ ] Delete customer works
- [ ] Orders page displays backend data
- [ ] Create order works
- [ ] Measurements CRUD operations
- [ ] Invoice generation and email sending
- [ ] Product costing calculations
- [ ] Pagination works correctly
- [ ] Search functionality works
- [ ] Error messages display properly
- [ ] Loading states show correctly
