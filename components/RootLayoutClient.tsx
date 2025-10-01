'use client';

import { ToastProvider } from '@/lib/toast';
import Link from 'next/link';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-0 py-2 z-50">
        <div className="grid grid-cols-5 h-14">
          <Link href="/" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-home-line text-lg text-gray-600"></i>
            <span className="text-xs text-gray-600">Home</span>
          </Link>
          <Link href="/orders" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-shopping-bag-line text-lg text-gray-600"></i>
            <span className="text-xs text-gray-600">Orders</span>
          </Link>
          <Link href="/customers" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-user-line text-lg text-gray-600"></i>
            <span className="text-xs text-gray-600">Customers</span>
          </Link>
          <Link href="/analytics" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-bar-chart-line text-lg text-teal-600"></i>
            <span className="text-xs text-teal-600">Analytics</span>
          </Link>
          <Link href="/invoices" className="flex flex-col items-center justify-center space-y-1">
            <i className="ri-file-list-line text-lg text-gray-600"></i>
            <span className="text-xs text-gray-600">Invoices</span>
          </Link>
        </div>
      </nav>
    </ToastProvider>
  );
}
