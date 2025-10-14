"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
  MouseEvent,
} from "react";
import classNames from "classnames";
import EditCustomerModal from "./EditCustomerModal";
import ConfirmDeleteModal from "@/app/inventory/ConfirmDeleteModal";
import apiClient from "@/lib/api";

type CustomerStatus = "vip" | "active" | "new" | "inactive" | string;

export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status?: CustomerStatus | null;
  totalOrders?: number | null;
  totalSpent?: number | null; // NGN
  joinDate?: string | Date | null; // ISO string or Date
  address?: string | null;
  gender?: string | null;
  age?: number | null;
}

type OrderStatus = "Completed" | "In Progress" | "Pending" | string;

export interface Order {
  id: string;
  item: string;
  status: OrderStatus;
  amount: number; // NGN
  date: string; // ISO
}

type MeasurementsMap = Record<string, number | string>;
interface MeasurementsPayload {
  values: MeasurementsMap;
  updatedAt?: string;
}

interface CustomerDetailProps {
  customer: Customer;
  onClose: () => void;
  // Optional: Provide data fetchers via props for easy testing/injection.
  fetchRecentOrders?: (customerId: string) => Promise<Order[]>;
  fetchMeasurements?: (
    customerId: string
  ) => Promise<MeasurementsPayload | null>;
}

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
});

const formatCurrency = (amount?: number | null) => {
  if (amount == null || Number.isNaN(amount)) return "—";
  return NGN.format(amount);
};

const daysSince = (date?: string | Date | null) => {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  const ms = Date.now() - d.getTime();
  const days = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  return `${days}d`;
};

const statusBadge = (status?: CustomerStatus | null) => {
  const s = (status ?? "").toString().toLowerCase();
  if (s === "vip") return "bg-purple-100 text-purple-700";
  if (s === "active") return "bg-green-100 text-green-700";
  if (s === "inactive") return "bg-gray-100 text-gray-700";
  return "bg-blue-100 text-blue-700";
};

const phoneHref = (phone?: string | null) =>
  phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;

const whatsappHref = (phone?: string | null) => {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
};

export default function CustomerDetail({
  customer,
  onClose,
}: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "measurements" | "orders"
  >("profile");

  console.log("Rendering CustomerDetail for customer:", customer);

  // Data states
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [measurements, setMeasurements] = useState<MeasurementsMap>({});
  const [measUpdatedAt, setMeasUpdatedAt] = useState<string | undefined>(
    undefined
  );
  const [measLoading, setMeasLoading] = useState(true);
  const [measError, setMeasError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Refs for interactions
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Fetch data (injectable; falls back to no-op if not provided)
  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      if (!customer?.id) {
        setOrdersLoading(false);
        return;
      }
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const res: any = await apiClient.orders.getCustomerOrders(customer.id);
        if (!mounted) return;
        setRecentOrders(res?.orders);
      } catch (e) {
        if (!mounted) return;
        setOrdersError("Failed to load orders.");
      } finally {
        if (!mounted) return;
        setOrdersLoading(false);
      }
    };

    const loadMeasurements = async () => {
      if (!customer?.id) {
        setMeasLoading(false);
        return;
      }
      setMeasLoading(true);
      setMeasError(null);
      try {
        const res: any = await apiClient.measurements.getCustomerMeasurements({
          customerId: customer.id,
        });
        if (!mounted) return;
        setMeasurements(res?.values ?? {});
        setMeasUpdatedAt(res?.updatedAt);
      } catch (e) {
        if (!mounted) return;
        setMeasError("Failed to load measurements.");
      } finally {
        if (!mounted) return;
        setMeasLoading(false);
      }
    };

    void loadOrders();
    void loadMeasurements();

    return () => {
      mounted = false;
    };
  }, [customer?.id]);

  // Accessibility: Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent | any) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey as any);
    return () => window.removeEventListener("keydown", onKey as any);
  }, [onClose]);

  // Focus the close button on open
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Backdrop click to close (ignore clicks inside sheet)
  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const tabs = useMemo(
    () => [
      { key: "profile" as const, label: "Profile", icon: "ri-user-line" },
      {
        key: "measurements" as const,
        label: "Measurements",
        icon: "ri-ruler-line",
      },
      { key: "orders" as const, label: "Orders", icon: "ri-shopping-bag-line" },
    ],
    []
  );

  const onTabsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const order: Array<typeof activeTab> = [
      "profile",
      "measurements",
      "orders",
    ];
    const idx = order.indexOf(activeTab);
    if (e.key === "ArrowRight") {
      setActiveTab(order[(idx + 1) % order.length]);
    } else if (e.key === "ArrowLeft") {
      setActiveTab(order[(idx - 1 + order.length) % order.length]);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center"
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Customer details"
    >
      <div
        ref={sheetRef}
        className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Customer Details
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenEdit(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              title="Edit customer"
            >
              <i className="ri-pencil-line text-gray-700" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100"
              title="Delete customer"
            >
              <i className="ri-delete-bin-6-line text-red-600" />
            </button>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              aria-label="Close"
            >
              <i className="ri-close-line text-gray-600" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Customer Header */}
          <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {customer?.name ?? "Unnamed Customer"}
                </h3>
                {customer?.age && (
                  <p className="text-gray-600 truncate">{customer.age} yrs.</p>
                )}
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  {customer?.gender && (
                    <span className="text-sm text-gray-600">
                      <i className="ri-user-line mr-1" />
                      {customer.gender.toLocaleUpperCase()}
                    </span>
                  )}
                  {customer?.status && (
                    <span
                      className={classNames(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        statusBadge(customer.status)
                      )}
                    >
                      {customer.status.toString().toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {customer?.totalOrders ?? 0}
              </div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(customer?.totalSpent ?? 0)}
              </div>
              <div className="text-xs text-gray-500">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {daysSince(customer?.joinDate)}
              </div>
              <div className="text-xs text-gray-500">Customer Since</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4">
            <div
              className="flex space-x-1 bg-gray-100 rounded-lg p-1"
              role="tablist"
              aria-label="Customer sections"
              onKeyDown={onTabsKeyDown}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  aria-controls={`panel-${tab.key}`}
                  id={`tab-${tab.key}`}
                  onClick={() => setActiveTab(tab.key)}
                  className={classNames(
                    "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 outline-none",
                    activeTab === tab.key
                      ? "bg-white text-teal-600 shadow-sm"
                      : "text-gray-600"
                  )}
                >
                  <i className={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {/* PROFILE */}
            <section
              id="panel-profile"
              role="tabpanel"
              aria-labelledby="tab-profile"
              hidden={activeTab !== "profile"}
            >
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <InfoRow
                        iconBg="bg-blue-100"
                        iconClass="ri-mail-line text-blue-600"
                        label="Email Address"
                        value={customer?.email ?? "—"}
                      />
                      <InfoRow
                        iconBg="bg-green-100"
                        iconClass="ri-phone-line text-green-600"
                        label="Phone Number"
                        value={customer?.phone ?? "—"}
                      />
                      <InfoRow
                        iconBg="bg-purple-100"
                        iconClass="ri-map-pin-line text-purple-600"
                        label="Address"
                        value={customer?.address ?? "—"}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={phoneHref(customer?.phone)}
                      className={classNames(
                        "flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2",
                        customer?.phone
                          ? "bg-teal-500 text-white"
                          : "bg-gray-200 text-gray-500 pointer-events-none"
                      )}
                    >
                      <i className="ri-phone-line" />
                      <span>Call</span>
                    </a>
                    <a
                      href={whatsappHref(customer?.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classNames(
                        "flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2",
                        customer?.phone
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500 pointer-events-none"
                      )}
                    >
                      <i className="ri-whatsapp-line" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* MEASUREMENTS */}
            <section
              id="panel-measurements"
              role="tabpanel"
              aria-labelledby="tab-measurements"
              hidden={activeTab !== "measurements"}
            >
              {activeTab === "measurements" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Body Measurements
                    </h4>

                    {measLoading ? (
                      <SkeletonGrid rows={6} />
                    ) : measError ? (
                      <EmptyState
                        icon="ri-error-warning-line"
                        title="Unable to load measurements"
                        subtitle={measError}
                      />
                    ) : Object.keys(measurements).length === 0 ? (
                      <EmptyState
                        icon="ri-ruler-line"
                        title="No measurements yet"
                        subtitle="Add measurements to get precise tailoring."
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(measurements).map(([key, value]) => (
                          <div key={key} className="bg-white rounded-lg p-3">
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 truncate">
                              {key.replace(/([A-Z])/g, " $1")}
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {String(value)}
                              {key.toLowerCase().includes("height")
                                ? " cm"
                                : '"'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-information-line text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-900">
                          Last Updated
                        </div>
                        <div className="text-xs text-blue-700">
                          {measUpdatedAt
                            ? new Date(measUpdatedAt).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium"
                    onClick={async () => {
                      // Fetch detailed measurement info for this customer (if API supports)
                      try {
                        const res: any = await apiClient.measurements.getCustomerMeasurements({ customerId: customer.id });
                        if (res?.values) setMeasurements(res.values);
                        if (res?.updatedAt) setMeasUpdatedAt(res.updatedAt);
                      } catch (e) {
                        console.error("Failed to refresh measurements", e);
                      }
                    }}
                  >
                    Refresh Measurements
                  </button>
                </div>
              )}
            </section>

            {/* ORDERS */}
            <section
              id="panel-orders"
              role="tabpanel"
              aria-labelledby="tab-orders"
              hidden={activeTab !== "orders"}
            >
              {activeTab === "orders" && (
                <div className="space-y-3">
                  {ordersLoading ? (
                    <SkeletonList rows={3} />
                  ) : ordersError ? (
                    <EmptyState
                      icon="ri-error-warning-line"
                      title="Unable to load orders"
                      subtitle={ordersError}
                    />
                  ) : recentOrders.length === 0 ? (
                    <EmptyState
                      icon="ri-shopping-bag-line"
                      title="No orders yet"
                      subtitle="This customer has no orders on record."
                    />
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-gray-900">
                            {order.item}
                          </div>
                          <span
                            className={classNames(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              order.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            )}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{order.id}</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(order.amount)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}

                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium mt-4">
                    View All Orders
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>

        {openEdit && (
          <EditCustomerModal
            open={openEdit}
            customer={{
              id: customer.id,
              name: customer.name,
              email: customer.email ?? undefined,
              phone: customer.phone ?? undefined,
              address: customer.address ?? undefined,
            }}
            onClose={() => setOpenEdit(false)}
            onSaved={(updated) => {
              (customer as any).name = updated.name;
              (customer as any).email = updated.email;
              (customer as any).phone = updated.phone;
              (customer as any).address = updated.address;
              setOpenEdit(false);
            }}
          />
        )}

        {showDeleteModal && (
          <ConfirmDeleteModal
            open={showDeleteModal}
            title="Delete customer"
            description={`Are you sure you want to delete "${customer.name}"? This action cannot be undone.`}
            confirmLabel="Delete"
            loading={deleting}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={async () => {
              if (!customer?.id) return;
              try {
                setDeleting(true);
                await apiClient.customers.delete(String(customer.id));
                window.dispatchEvent(new CustomEvent("customer-deleted", { detail: { id: customer.id } }));
                setShowDeleteModal(false);
                onClose();
              } catch (err) {
                console.error("Failed to delete customer", err);
              } finally {
                setDeleting(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Small Presentational Helpers ---------- */

function InfoRow({
  iconBg,
  iconClass,
  label,
  value,
}: {
  iconBg: string;
  iconClass: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={classNames(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          iconBg
        )}
      >
        <i className={classNames(iconClass, "text-sm")} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {value || "—"}
        </div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center bg-white">
      <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-3">
        <i className={classNames(icon, "text-gray-500 text-xl")} />
      </div>
      <div className="font-semibold text-gray-900">{title}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}

function SkeletonGrid({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
          <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-20 bg-gray-200 rounded mt-2" />
        </div>
      ))}
    </div>
  );
}
