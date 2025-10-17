"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDeleteModal from "@/app/inventory/ConfirmDeleteModal";
import { useBusinessId } from "../hooks/useBusinessId";
import apiClient from "@/lib/api";
import moment from "moment";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "measuring":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getProgress = (status: string) => {
  switch (status) {
    case "pending":
      return 25;
    case "measuring":
      return 50;
    case "in_progress":
      return 75;
    case "completed":
      return 100;
    default:
      return 0;
  }
};

export default function Orders() {
  const businessId = useBusinessId();
  const [activeTab, setActiveTab] = useState("all");
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>({});
  const [editStatus, setEditStatus] = useState<string>("");
  const [editDeliveryDate, setEditDeliveryDate] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChoice, setStatusChoice] = useState<string>("pending");

  const fetchOrders = async () => {
    const result: any = await apiClient.orders.getAll({ businessId });
    setOrderData(result);
  };

  useEffect(() => {
    if (businessId) void fetchOrders();
  }, [businessId]);

  const filteredOrders =
    orderData?.orders?.filter((order: any) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return order.status === "pending";
      if (activeTab === "progress") return order.status === "in_progress";
      if (activeTab === "completed") return order.status === "completed";
      return false;
    }) || [];

  const totalOrders = orderData?.orders?.length || 0;
  const totalRevenue = orderData?.orders
    ?.reduce(
      (sum: number, order: any) => sum + parseFloat(order.totalAmount || 0),
      0
    )
    .toFixed(2);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Prefill edit fields when opening the details modal
  useEffect(() => {
    if (showOrderDetails && selectedOrder) {
      setEditStatus(selectedOrder.status || "pending");
      setStatusChoice(selectedOrder.status || "pending");
      setEditDeliveryDate(
        selectedOrder.deliveryDate
          ? moment(selectedOrder.deliveryDate).format("YYYY-MM-DD")
          : ""
      );
      setEditNotes(selectedOrder.notes || "");
      
    }
  }, [showOrderDetails, selectedOrder]);

  const handleSaveChanges = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedOrder?.id) return;
    try {
      setSaving(true);
      await apiClient.orders.update(String(selectedOrder.id), {
        status: editStatus,
        deliveryDate: editDeliveryDate,
        notes: editNotes,
      });
      await fetchOrders();
      // Update selected order snapshot
      setSelectedOrder((prev: any) =>
        prev
          ? {
              ...prev,
              status: editStatus,
              deliveryDate: editDeliveryDate,
              notes: editNotes,
            }
          : prev
      );
    } catch (err) {
      console.error("Failed to update order", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedOrder?.id) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder?.id) return;
    try {
      setDeleting(true);
      await apiClient.orders.delete(String(selectedOrder.id));
      await fetchOrders();
      setShowDeleteModal(false);
      setShowOrderDetails(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Failed to delete order", err);
    } finally {
      setDeleting(false);
    }
  };

  const firstItemName = (items: any[]) =>
    items[0]?.productName || "Multiple Items";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
          <h1 className="font-semibold text-gray-800">Orders</h1>
          <Link
            href="/orders/new"
            className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center"
          >
            <i className="ri-add-line text-white text-sm"></i>
          </Link>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* Stats Cards */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-shopping-bag-line text-blue-600 text-lg"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalOrders}
                  </p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-green-600 text-lg"></i>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalRevenue}
                  </p>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="bg-gray-100 rounded-full p-1 flex mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "all"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "pending"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "progress"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
                activeTab === "completed"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Done
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="px-4 space-y-3">
          {filteredOrders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {getInitials(order.customer.name)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-gray-500">{order.orderNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                    title="Share order"
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        const url = `${window.location.origin}/orders/${order.id}`;
                        if (navigator.share) {
                          navigator.share({ title: `Order ${order.orderNumber}`, url });
                        } else {
                          navigator.clipboard.writeText(url);
                          alert("Link copied to clipboard");
                        }
                      } catch (err) {
                        console.error("Share failed", err);
                      }
                    }}
                  >
                    <i className="ri-share-line text-gray-600" />
                  </button>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="font-medium text-gray-800 mb-1">
                  {firstItemName(order.items)}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Delivery: {moment(order.deliveryDate).format("DD/MM/YYYY")}
                  </span>
                  <span className="font-semibold text-indigo-600">
                    {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">Order Details</h3>
              <div className="flex items-center gap-2">
                <Link
                  href={selectedOrder ? `/orders/edit?id=${selectedOrder.id}` : "#"}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                  title="Edit order"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="ri-pencil-line text-gray-600"></i>
                </Link>
                <button
                  onClick={handleDeleteOrder}
                  disabled={deleting}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                  title="Delete order"
                >
                  <i className={`ri-delete-bin-line ${deleting ? "text-gray-300" : "text-red-600"}`}></i>
                </button>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-indigo-600">
                    {getInitials(selectedOrder.customer.name)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {selectedOrder.customer.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.orderNumber}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-800 mb-3">
                  Order Information
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Item</p>
                    <p className="font-medium text-gray-800">
                      {firstItemName(selectedOrder.items)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-semibold text-indigo-600">
                      {selectedOrder.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-800">
                      {moment(selectedOrder.orderDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Delivery Date</p>
                    <p className="font-medium text-gray-800">
                      {moment(selectedOrder.deliveryDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Order (toggle) removed */}

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800">Progress</h5>
                  <span className="text-sm font-medium text-gray-600">
                    {getProgress(selectedOrder.status)}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress(selectedOrder.status)}%` }}
                  ></div>
                </div>

                {/* Progress Steps */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-white text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-700">
                      Measurements taken
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-white text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-700">
                      Design confirmed
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-700">
                      Cutting in progress
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Sewing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Final fitting</span>
                  </div>
                </div>
              </div>

              {/* Actions (keep original) */}
              <div className="flex space-x-3 pt-4 pb-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusChoice(selectedOrder?.status || "pending");
                    setShowStatusModal(true);
                  }}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium"
                >
                  Update Status
                </button>
                <button className="flex-1 py-3 border border-gray-200 rounded-lg font-medium text-gray-600">
                  Contact Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        title="Delete order"
        description={
          selectedOrder ? (
            <>
              Are you sure you want to delete order <strong>{selectedOrder.orderNumber}</strong>?
              This action cannot be undone.
            </>
          ) : (
            "Are you sure you want to delete this order?"
          )
        }
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      {/* Update Status Modal */}
      <ConfirmDeleteModal
        open={showStatusModal}
        title="Update Order Status"
        description={
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Select a new progress status for this order.</p>
            <select
              value={statusChoice}
              onChange={(e) => setStatusChoice(e.currentTarget.value)}
              className="w-full p-2 border border-gray-200 rounded"
            >
              <option value="pending">Pending</option>
              <option value="measuring">Measuring</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        }
        confirmLabel="Update"
        loading={saving}
        onCancel={() => setShowStatusModal(false)}
        onConfirm={async () => {
          if (!selectedOrder?.id) return;
          try {
            setSaving(true);
            await apiClient.orders.update(String(selectedOrder.id), { status: statusChoice });
            await fetchOrders();
            setSelectedOrder((prev: any) => (prev ? { ...prev, status: statusChoice } : prev));
            setShowStatusModal(false);
          } catch (err) {
            console.error("Failed to update status", err);
          } finally {
            setSaving(false);
          }
        }}
      />

      

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-2">
        <div className="grid grid-cols-5 gap-1">
          <Link href="/" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-home-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </Link>

          <Link
            href="/measurements"
            className="flex flex-col items-center py-2 px-1"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-ruler-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Measure</span>
          </Link>

          <Link href="/orders" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-shopping-bag-line text-indigo-600 text-lg"></i>
            </div>
            <span className="text-xs text-indigo-600 font-medium mt-1">
              Orders
            </span>
          </Link>

          <Link
            href="/customers"
            className="flex flex-col items-center py-2 px-1"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-group-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Customers</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center py-2 px-1"
          >
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
