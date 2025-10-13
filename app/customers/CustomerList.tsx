"use client";

import { useState, useEffect, use } from "react";
import apiClient from "@/lib/api";
import { useBusinessId } from "../hooks/useBusinessId";

interface CustomerListProps {
  searchQuery: string;
  filterStatus: string;
  onSelectCustomer: (customer: any) => void;
}

export default function CustomerList({
  searchQuery,
  filterStatus,
  onSelectCustomer,
}: CustomerListProps) {
  const businessId = useBusinessId();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (!businessId) return;
        setLoading(true);
        const result: any = await apiClient.customers.getMyCustomer({
          businessId,
          search: searchQuery,
          page: page.toString(),
          limit: "20",
        });

        let filtered = result.customers || [];

        if (filterStatus !== "all") {
          filtered = filtered.filter((c: any) => {
            if (filterStatus === "vip") return parseFloat(c.totalSpent) > 5000;
            if (filterStatus === "active") return c.orderCount > 0;
            if (filterStatus === "new") {
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
        console.error("Failed to fetch customers:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [searchQuery, filterStatus, page, businessId]);

  // Listen for customer deletions from detail modal and update local list
  useEffect(() => {
    const onDeleted = (e: any) => {
      const id = e?.detail?.id;
      if (!id) return;
      setCustomers((prev) => prev.filter((c) => String(c.id) !== String(id)));
    };
    window.addEventListener("customer-deleted", onDeleted as any);
    return () => window.removeEventListener("customer-deleted", onDeleted as any);
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="flex items-center justify-center">
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (customer: any) => {
    const totalSpent = parseFloat(customer.totalSpent) || 0;
    if (totalSpent > 5000) {
      return {
        label: "VIP",
        color: "bg-purple-100 text-purple-700",
        dotColor: "bg-purple-500",
      };
    }
    if (customer.orderCount > 0) {
      return {
        label: "ACTIVE",
        color: "bg-green-100 text-green-700",
        dotColor: "bg-green-500",
      };
    }
    return {
      label: "NEW",
      color: "bg-blue-100 text-blue-700",
      dotColor: "bg-blue-500",
    };
  };

  const formatCurrency = (amount: number) => {
    return `$${parseFloat(amount.toString()).toLocaleString()}`;
  };

  if (customers.length === 0) {
    return (
      <div className="px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-search-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No customers found
          </h3>
          <p className="text-gray-500 text-sm">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Add your first customer to get started"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="space-y-3">
        {customers.map((customer) => {
          const badge = getStatusBadge(customer);
          return (
            <div
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {customer.name?.charAt(0).toUpperCase() || "C"}
                    </span>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${badge.dotColor}`}
                  ></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {customer.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{customer.email}</span>
                    <span>{customer.orderCount} orders</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span className="flex items-center">
                        <i className="ri-phone-line mr-1"></i>
                        {customer.phone?.slice(-4) || "N/A"}
                      </span>
                      <span className="flex items-center">
                        <i className="ri-map-pin-line mr-1"></i>
                        {customer.city || "N/A"}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-teal-600">
                      {formatCurrency(customer.totalSpent)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
