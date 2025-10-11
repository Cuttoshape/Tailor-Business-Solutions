import apiClient from "@/lib/api";
import React, { useEffect, useMemo, useRef, useState } from "react";

export type Customer = {
  id: string | number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  age?: number;
  gender?: string;
  /** Optional short label to show in the circle (e.g. initials). If omitted, we'll derive initials from `name`. */
  avatar?: string;
};

type CustomerLookupProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  initialQuery?: string;
  /** If true, clicking the shaded backdrop closes the modal (default: true) */
  allowBackdropClose?: boolean;
  /** Optional aria-labelledby and aria-describedby ids for a11y */
  labelledById?: string;
  describedById?: string;
};

export default function CustomerLookup({
  open,
  onClose,
  onSelect,
  initialQuery = "",
  allowBackdropClose = true,
  labelledById,
  describedById,
}: CustomerLookupProps) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { customers } = await apiClient.customers.getMyCustomer();
        setCustomers(customers);
      } catch (error) {
        console.error("Failed to fetch customer insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debounce the query for snappier typing on large lists
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 150);
    return () => clearTimeout(t);
  }, [query]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setActiveIndex(-1);
      // Slight timeout so autofocus is reliable after mount
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const filteredCustomers = useMemo(() => {
    if (!debouncedQuery) return customers;
    const q = debouncedQuery.toLowerCase();
    return customers.filter((c: Customer) => {
      const name = c.name?.toLowerCase() ?? "";
      const phone = c.phone?.toLowerCase() ?? "";
      const email = c.email?.toLowerCase() ?? "";
      return name.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [customers, debouncedQuery]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!allowBackdropClose) return;
    if (e.target === e.currentTarget) onClose();
  };

  const initials = (name?: string) =>
    (name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "?";

  const moveActive = (dir: 1 | -1) => {
    if (!filteredCustomers.length) return;
    setActiveIndex((prev) => {
      const next =
        (prev + dir + filteredCustomers.length) % filteredCustomers.length;
      // Ensure the active item is visible
      const container = listRef.current;
      const item = container?.querySelector<HTMLButtonElement>(
        `[data-index="${next}"]`
      );
      if (container && item) {
        const cTop = container.scrollTop;
        const cBottom = cTop + container.clientHeight;
        const iTop = item.offsetTop;
        const iBottom = iTop + item.offsetHeight;
        if (iTop < cTop) container.scrollTop = iTop;
        else if (iBottom > cBottom)
          container.scrollTop = iBottom - container.clientHeight;
      }
      return next;
    });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!filteredCustomers.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filteredCustomers.length) {
        onSelect(filteredCustomers[activeIndex]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end mb-20"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledById}
      aria-describedby={describedById}
    >
      <div
        className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
      >
        {/* Header + Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 id={labelledById} className="font-semibold text-gray-800">
              Find Customer
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
              aria-label="Close"
            >
              <i className="ri-close-line text-gray-600"></i>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name, phone, or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div ref={listRef} className="overflow-y-auto max-h-[60vh] p-4 mb-20">
          {filteredCustomers.length > 0 ? (
            <div className="space-y-3">
              {filteredCustomers.map((customer: Customer, idx) => (
                <button
                  key={customer.id}
                  data-index={idx}
                  onClick={() => {
                    onSelect(customer);
                    onClose();
                  }}
                  className={`w-full p-4 rounded-lg text-left transition-colors border border-transparent ${
                    idx === activeIndex
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-indigo-600">
                        {customer.avatar || initials(customer.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {customer.name}
                      </p>
                      {customer.phone && (
                        <p className="text-sm text-gray-500 truncate">
                          {customer.phone}
                        </p>
                      )}
                      {customer.email && (
                        <p className="text-xs text-gray-400 truncate">
                          {customer.email}
                        </p>
                      )}
                    </div>
                    <i className="ri-arrow-right-line text-gray-400 shrink-0"></i>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-search-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No customers found
              </h3>
              <p id={describedById} className="text-gray-500 text-sm">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
