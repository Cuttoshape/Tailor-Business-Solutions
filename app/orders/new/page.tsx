"use client";

import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomerLookup, { Customer } from "@/components/CustomerLookup";
import ProductLookup from "@/components/ProductLookup";
import { Product } from "@/app/inventory/page";
import CustomerBioAddForm from "@/components/CustomerBioAddForm";
import BusinessBanner from "@/components/BusinessBanner";
import { useBusinessId } from "@/app/hooks/useBusinessId";
import {
  femaleMeasurements,
  maleMeasurements,
} from "@/app/measurements/new/page";
import Costing from "@/components/Costing";

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${year}-${month}${random}`;
};

const activeMeasurements = {
  female: femaleMeasurements,
  male: maleMeasurements,
};

type OrderData = {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    age: string;
  };
  items: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    lowPrice: string;
    highPrice: string;
    options: Record<string, any>;
    fabric: string;
    costMethod: string;
    fabricPrice: string;
    fabricName: string;
  }>;
  vatOrTax: number;
  measurements: Record<string, string>;
  shippingCost: number;
  profit: number;
  estimatedDelivery: string;
  notes: string;
  orderDate: string;
  expiryDate: string;
  placeOfSale: string;
  referralSource: string;
  marketplaceName: string;
  deliveryDate: string;
  urgentOrder: boolean;
  estimatedPrice: string;
  advancePayment: string;
  status: string;
};

type ItemType = {
  id: string;
  name: string;
  icon: string;
  price: number;
};

const itemTypes: ItemType[] = [
  {
    id: "wedding-dress",
    name: "Wedding Dress",
    icon: "ri-heart-line",
    price: 450,
  },
  {
    id: "business-suit",
    name: "Business Suit",
    icon: "ri-briefcase-line",
    price: 320,
  },
  {
    id: "evening-gown",
    name: "Evening Gown",
    icon: "ri-star-line",
    price: 380,
  },
  {
    id: "casual-shirt",
    name: "Casual Shirt",
    icon: "ri-shirt-line",
    price: 85,
  },
  {
    id: "formal-dress",
    name: "Formal Dress",
    icon: "ri-user-6-line",
    price: 280,
  },
  { id: "custom", name: "Custom Item", icon: "ri-add-circle-line", price: 0 },
];

const fabrics = [
  "Cotton",
  "Silk",
  "Wool",
  "Linen",
  "Polyester",
  "Chiffon",
  "Satin",
  "Velvet",
  "Denim",
  "Lace",
];

const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#1e3a8a" },
  { name: "Gray", value: "#6b7280" },
  { name: "Red", value: "#dc2626" },
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#16a34a" },
  { name: "Purple", value: "#9333ea" },
  { name: "Pink", value: "#ec4899" },
  { name: "Brown", value: "#a3a3a3" },
];

type SalesChannel = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const salesChannels: SalesChannel[] = [
  {
    id: "walk-in",
    name: "Walk-in Store",
    icon: "ri-store-2-line",
    description: "Customer visited physical store",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "ri-instagram-line",
    description: "Social media referral",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "ri-whatsapp-line",
    description: "Direct messaging",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "ri-facebook-line",
    description: "Facebook page or ads",
  },
  {
    id: "referral",
    name: "Customer Referral",
    icon: "ri-user-heart-line",
    description: "Referred by existing customer",
  },
  {
    id: "website",
    name: "Website",
    icon: "ri-global-line",
    description: "Online website inquiry",
  },
  {
    id: "phone",
    name: "Phone Call",
    icon: "ri-phone-line",
    description: "Direct phone contact",
  },
  {
    id: "marketplace",
    name: "Marketplace/Event",
    icon: "ri-calendar-event-line",
    description: "Trade show or market event",
  },
];

interface CustomerInfoStepProps {
  orderData: OrderData;
  setCustomer: (customer: any) => void;
  showCustomerLookup: boolean;
  setShowCustomerLookup: (val: boolean) => void;
  handleCustomerSelect: (customer: Customer) => void;
  selectedCustomer?: Customer;
}

const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  orderData,
  setCustomer,
  showCustomerLookup,
  setShowCustomerLookup,
  handleCustomerSelect,
  selectedCustomer,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Customer Information
        </h2>
        <p className="text-sm text-gray-600">
          Enter customer details for the new order
        </p>
      </div>

      {/* Customer Lookup Toggle */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setShowCustomerLookup(true)}
          className="flex-1 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm flex items-center justify-center space-x-2"
        >
          <i className="ri-search-line"></i>
          <span>Find Customer</span>
        </button>
      </div>

      <CustomerBioAddForm
        customer={selectedCustomer}
        formData={orderData.customer}
        setFormData={setCustomer}
      />
    </div>
  );
};

interface MeasurementsStepProps {
  gender: string;
  measurements: Record<string, string>;
  onMeasurementChange: (key: string, value: string) => void;
  activeMeasurements: typeof femaleMeasurements;
  loadedFromProfile?: boolean;
  onGenderChange: (gender: "female" | "male") => void;
  loading?: boolean;
}

const MeasurementsStep: React.FC<MeasurementsStepProps> = ({
  gender,
  measurements,
  onMeasurementChange,
  activeMeasurements,
  loadedFromProfile,
  onGenderChange,
  loading,
}) => {
  return (
    <div>
      <h4 className="font-medium text-gray-800 mb-3">
        Body Measurements {gender === "female" ? "(Female)" : "(Male)"}
      </h4>
      {loading && (
        <div className="mb-3 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
          Loading saved measurements...
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Select gender:</span>
        <button
          type="button"
          onClick={() => onGenderChange("female")}
          className={`px-3 py-1 rounded text-sm ${
            gender === "female" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Female
        </button>
        <button
          type="button"
          onClick={() => onGenderChange("male")}
          className={`px-3 py-1 rounded text-sm ${
            gender === "male" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Male
        </button>
      </div>
      {loadedFromProfile && (
        <div className="mb-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">
          Prefilled with saved measurements for this customer. You can edit any field.
        </div>
      )}
      <div className="space-y-3">
        {gender &&
          activeMeasurements[gender as "female" | "male"]?.map((m) => (
            <div key={m.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {m.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-3 pr-16 border border-gray-200 rounded-lg text-sm"
                  placeholder="0.0"
                  value={measurements[m.key] ?? ""}
                  onChange={(e) => onMeasurementChange(m.key, e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {m.unit}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

interface PlaceOfSaleStepProps {
  placeOfSale: string;
  referralSource: string;
  marketplaceName: string;
  onInputChange: (field: string, value: any) => void;
  salesChannels: SalesChannel[];
}

const PlaceOfSaleStep: React.FC<PlaceOfSaleStepProps> = ({
  placeOfSale,
  referralSource,
  marketplaceName,
  onInputChange,
  salesChannels,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Place of Sale
        </h2>
        <p className="text-sm text-gray-600">How did this customer find you?</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {salesChannels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onInputChange("placeOfSale", channel.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              placeOfSale === channel.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  placeOfSale === channel.id ? "bg-indigo-100" : "bg-gray-100"
                }`}
              >
                <i
                  className={`${channel.icon} text-lg ${
                    placeOfSale === channel.id
                      ? "text-indigo-600"
                      : "text-gray-600"
                  }`}
                ></i>
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    placeOfSale === channel.id
                      ? "text-indigo-900"
                      : "text-gray-900"
                  }`}
                >
                  {channel.name}
                </p>
                <p className="text-sm text-gray-500">{channel.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {placeOfSale === "referral" && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referral Source
          </label>
          <input
            type="text"
            value={referralSource}
            onChange={(e) => onInputChange("referralSource", e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="Who referred this customer?"
          />
        </div>
      )}

      {placeOfSale === "marketplace" && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marketplace/Event Name
          </label>
          <input
            type="text"
            value={marketplaceName}
            onChange={(e) => onInputChange("marketplaceName", e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="Enter marketplace or event name"
          />
        </div>
      )}
    </div>
  );
};

interface ItemsPricingStepProps {
  orderData: OrderData;
  currency: string;
  setCurrency: (currency: string) => void;
  updateItem: (index: number, field: string, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  formatCurrency: (amount: number) => string;
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  setShowProductLookup: (val: boolean) => void;
  setShowCostCalculator: (val: boolean) => void;
  handleSaveCosting: (costItems: any) => void;
  onInputChange: (field: string, value: any) => void;
}

const ItemsPricingStep: React.FC<ItemsPricingStepProps> = ({
  orderData,
  currency,
  setCurrency,
  updateItem,
  addItem,
  removeItem,
  calculateSubtotal,
  calculateTotal,
  formatCurrency,
  currentIndex,
  setCurrentIndex,
  setShowProductLookup,
  setShowCostCalculator,
  handleSaveCosting,
  onInputChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Items & Pricing</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrency("NGN")}
            className={`px-3 py-1 rounded text-sm ${
              currency === "NGN"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            NGN
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded text-sm ${
              currency === "USD"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            USD
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {orderData.items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex justify-between items-center w-full">
                  <h4 className="font-medium text-gray-800">
                    Item {index + 1}
                  </h4>
                  <button
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowProductLookup(true);
                    }}
                    className="py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm flex items-center justify-center space-x-2"
                  >
                    <i className="ri-search-line"></i>
                    <span>Find Product</span>
                  </button>
                </div>

                {orderData.items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="w-6 h-6 flex items-center justify-center text-red-500"
                  >
                    <i className="ri-delete-bin-line text-sm"></i>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />

                <textarea
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  className="w-full p-2 border border-gray-200 rounded text-sm h-16"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full p-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                </div>
                {item.costMethod !== "calculator" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fabric
                      </label>
                      {(() => {
                        const fabricTypes = (item as any)?.options?.fabricTypes as
                          | Array<{ name: string; cost: number | string }>
                          | undefined;
                        const list = Array.isArray(fabricTypes)
                          ? fabricTypes
                          : [];
                        return (
                          <select
                            value={item.fabricName}
                            onChange={(e) => {
                              const name = e.target.value;
                              updateItem(index, "fabricName", name);
                              const found = list.find((f) => f.name === name);
                              if (found) {
                                updateItem(
                                  index,
                                  "fabricPrice",
                                  String(found.cost ?? "")
                                );
                              }
                            }}
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                          >
                            <option value="">Select one</option>
                            {list.map((f) => (
                              <option key={f.name} value={f.name}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        );
                      })()}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fabric Price
                      </label>
                      <input
                        type="number"
                        value={item.fabricPrice}
                        onChange={(e) =>
                          updateItem(index, "fabricPrice", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                        placeholder="$0"
                      />
                    </div>
                  </div>
                )}

                <div className="flex text-right text-sm font-medium text-gray-700 justify-between items-center">
                  <button
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowCostCalculator(true);
                    }}
                    className="py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm flex items-center justify-center space-x-2"
                  >
                    <span>Cost Calculator </span>
                  </button>
                  Subtotal: {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium"
          >
            + Add Another Item
          </button>
        </div>

        {/* Additional Costs */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Additional Costs</h4>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Handling & Shipping
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={orderData.shippingCost}
                onChange={(e) => onInputChange("shippingCost", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                VAT Rate (%)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="7.5"
                  value={orderData.vatOrTax}
                  onChange={(e) =>
                    onInputChange("vatOrTax", parseFloat(e.target.value))
                  }
                  className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
                  step="0.1"
                  min="0"
                  max="100"
                />
                <div className="flex space-x-1">
                  <button
                    onClick={() => onInputChange("vatOrTax", 0)}
                    className={`px-3 py-2 rounded text-xs ${
                      orderData.vatOrTax === 0
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    0%
                  </button>
                  <button
                    onClick={() => onInputChange("vatOrTax", 7.5)}
                    className={`px-3 py-2 rounded text-xs ${
                      orderData.vatOrTax === 7.5
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    7.5%
                  </button>
                  <button
                    onClick={() => onInputChange("vatOrTax", 15)}
                    className={`px-3 py-2 rounded text-xs ${
                      orderData.vatOrTax === 15
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    15%
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatCurrency(orderData.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT/Tax:</span>
              <span>
                {formatCurrency(
                  (orderData.vatOrTax * calculateSubtotal()) / 100
                )}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg text-indigo-600">
                <span>Total:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrderDetailsStepProps {
  orderData: OrderData;
  onInputChange: (field: string, value: any) => void;
  salesChannels: SalesChannel[];
}

const OrderDetailsStep: React.FC<OrderDetailsStepProps> = ({
  orderData,
  onInputChange,
  salesChannels,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Order Details
        </h2>
        <p className="text-sm text-gray-600">
          Set delivery date and payment information
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expected Delivery Date *
        </label>
        <input
          type="date"
          value={orderData.deliveryDate}
          onChange={(e) => onInputChange("deliveryDate", e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-sm"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Expiry Date
        </label>
        <input
          type="date"
          value={orderData.expiryDate}
          onChange={(e) => onInputChange("expiryDate", e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Amount
          </label>
          <input
            type="number"
            value={orderData.advancePayment}
            onChange={(e) => onInputChange("advancePayment", e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="$0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            value={orderData.status}
            onChange={(e) => onInputChange("status", e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial Payment</option>
            <option value="paid">Fully Paid</option>
          </select>
        </div>
      </div>
    </div>
  );
};

interface InvoicePreviewStepProps {
  businessId: string;
  orderData: OrderData;
  onNotesChange: (notes: string) => void;
  orderNumber: string;
  formatCurrency: (amount: number) => string;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
}

const InvoicePreviewStep: React.FC<InvoicePreviewStepProps> = ({
  businessId,
  orderData,
  onNotesChange,
  orderNumber,
  formatCurrency,
  calculateSubtotal,
  calculateTotal,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Invoice Preview</h2>

      <div className="mb-2">
        <BusinessBanner businessId={businessId} />
      </div>

      {/* Invoice Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">PROFORMA INVOICE</h2>
          <p className="text-gray-600">{orderNumber}</p>
          <p>{new Date(orderData.orderDate).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
            <p className="text-gray-700">{orderData.customer.name}</p>
            <p className="text-gray-600 text-sm">{orderData.customer.email}</p>
            <p className="text-gray-600 text-sm">{orderData.customer.phone}</p>
            {orderData.customer.address && (
              <p className="text-gray-600 text-sm mt-1">
                {orderData.customer.address}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="text-gray-600 text-sm">Expiry Date: </span>
              <span className="font-medium">
                {new Date(orderData.expiryDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Delivery: </span>
              <span className="font-medium">
                {new Date(orderData.deliveryDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-semibold text-gray-900">
                  Item
                </th>
                <th className="text-center py-2 text-sm font-semibold text-gray-900">
                  Qty
                </th>
                <th className="text-right py-2 text-sm font-semibold text-gray-900">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="text-center py-3 text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="text-right py-3 font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>
              {orderData.shippingCost > 0 && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {formatCurrency(orderData.shippingCost)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1">
                <span className="text-gray-600">VAT/TAX:</span>
                <span className="font-medium">
                  {formatCurrency(
                    (orderData.vatOrTax * calculateSubtotal()) / 100
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Thank you for your business!</p>
          <p className="mt-2">
            This is a proforma invoice. Payment is due upon acceptance.
          </p>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          value={orderData.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg h-20"
          placeholder="Add any additional notes or terms..."
        />
      </div>
    </div>
  );
};

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-1 mb-6">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step}
          </div>
          {step < 6 && (
            <div
              className={`w-6 h-0.5 ${
                step < currentStep ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function NewOrderPage() {
  const router = useRouter();
  const businessId = useBusinessId();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [showCostCalculator, setShowCostCalculator] = useState(false);
  const [showProductLookup, setShowProductLookup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState(generateInvoiceNumber());
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [orderData, setOrderData] = useState<OrderData>({
    customer: {
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      age: "",
    },
    items: [
      {
        id: "",
        name: "",
        description: "",
        quantity: 1,
        price: 0,
        lowPrice: "",
        highPrice: "",
        options: {},
        fabric: "",
        costMethod: "",
        fabricPrice: "",
        fabricName: "",
      },
    ],
    vatOrTax: 0,
    measurements: {},
    shippingCost: 0,
    profit: 0,
    estimatedDelivery: "",
    notes: "",
    orderDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    placeOfSale: "",
    referralSource: "",
    marketplaceName: "",
    deliveryDate: "",
    urgentOrder: false,
    estimatedPrice: "",
    advancePayment: "",
    status: "pending",
  });

  const [currency, setCurrency] = useState("NGN");
  const [measurementsLoaded, setMeasurementsLoaded] = useState(false);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const [customer, setCustomer] = useState({});

  useEffect(() => {
    setOrderData((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...customer },
    }));
  }, [customer]);

  const handleCustomerSelect = (customer: Customer) => {
    const normalizeGender = (g?: string | null) => {
      const v = (g || "").toString().trim().toLowerCase();
      if (["female", "f"].includes(v)) return "female";
      if (["male", "m"].includes(v)) return "male";
      return "";
    };
    const normalizedGender = normalizeGender(customer.gender as any);
    setOrderData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        id: customer.id.toString(),
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        gender: normalizedGender,
        age: customer.age?.toString() || "",
      },
    }));
    setSelectedCustomer(customer);
    setShowCustomerLookup(false);
    setCustomerSearchQuery("");
    setMeasurementsLoaded(false);
    // If already on step 2, prefill immediately
    if (currentStep === 2 && customer.id) {
      void prefillMeasurementsForCustomer(customer.id.toString());
    }
  };

  const handleInputChange = (field: keyof OrderData, value: any) => {
    setOrderData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMeasurementChange = (key: string, value: string) => {
    setOrderData((prev) => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value },
    }));
  };

  const prefillMeasurementsForCustomer = async (custId: string) => {
    try {
      setLoadingMeasurements(true);
      const resp: any = await apiClient.measurements.getAll({ customerId: custId });
      const list = Array.isArray(resp?.measurements) ? resp.measurements : [];
      if (list.length > 0) {
        const latest = list[0];
        const data = latest?.measurements || {};
        const normalized: Record<string, string> = {};
        Object.keys(data || {}).forEach((k) => {
          const v = (data as any)[k];
          if (v !== undefined && v !== null) normalized[k] = String(v);
        });
        setOrderData((prev) => ({ ...prev, measurements: { ...prev.measurements, ...normalized } }));
        setMeasurementsLoaded(true);
        // Ensure fields are visible if gender was not selected
        setOrderData((prev) => {
          if (!prev.customer.gender) {
            return { ...prev, customer: { ...prev.customer, gender: "female" } };
          }
          return prev;
        });
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingMeasurements(false);
    }
  };

  // Prefill measurements when entering Step 2 and a customer is selected
  useEffect(() => {
    const custId = orderData.customer.id;
    if (currentStep === 2 && custId && !measurementsLoaded) {
      void prefillMeasurementsForCustomer(custId);
    }
  }, [currentStep, orderData.customer.id, measurementsLoaded]);

  const updateItem = (index: number, field: string, value: any) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateSubtotal = () => {
    return orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() +
      Number(orderData.shippingCost) +
      (Number(orderData.vatOrTax) * calculateSubtotal()) / 100
    );
  };

  const addItem = () => {
    setOrderData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: "",
          name: "",
          description: "",
          quantity: 1,
          price: 0,
          lowPrice: "",
          highPrice: "",
          options: {},
          fabric: "",
          costMethod: "",
          fabricPrice: "",
          fabricName: "",
        },
      ],
    }));
  };

  const handleProductSelect = (product: Product) => {
    if (currentIndex === null) return;
    const { name, description, lowPrice, highPrice, options, id } = product;

    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === currentIndex
          ? {
              ...item,
              name,
              description: description || "",
              id: id.toString(),
              options,
              lowPrice: lowPrice.toString(),
              highPrice: highPrice.toString(),
              // Set default unit price from product low price
              price: Number(lowPrice) || 0,
              // Initialize fabric selection from product options if available
              ...(Array.isArray((options as any)?.fabricTypes) &&
              (options as any).fabricTypes.length > 0
                ? {
                    fabricName: (options as any).fabricTypes[0].name || "",
                    fabricPrice: String((options as any).fabricTypes[0].cost ?? ""),
                  }
                : {}),
            }
          : item
      ),
    }));

    setShowProductLookup(false);
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveCosting = (costItems: any) => {
    if (currentIndex === null) return;
    // Example: Update item with cost data
    updateItem(currentIndex, "price", costItems.overallCost);
    updateItem(currentIndex, "costItems", costItems);
    updateItem(currentIndex, "costMethod", "calculator");
    setShowCostCalculator(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const newOrder = {
        ...orderData,
        orderNumber,
        estimatedPrice: calculateTotal(),
        businessId,
      };
      console.log("------NEW-----ORDER------", newOrder);
      const result = await apiClient.orders.create(newOrder);
      // Navigate back to orders page
      router.push("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerInfoStep
            orderData={orderData}
            setCustomer={setCustomer}
            showCustomerLookup={showCustomerLookup}
            setShowCustomerLookup={setShowCustomerLookup}
            handleCustomerSelect={handleCustomerSelect}
            selectedCustomer={selectedCustomer}
          />
        );
      case 2:
        return (
          <MeasurementsStep
            gender={orderData.customer.gender}
            measurements={orderData.measurements}
            onMeasurementChange={handleMeasurementChange}
            activeMeasurements={activeMeasurements}
            loadedFromProfile={measurementsLoaded}
            onGenderChange={(g) =>
              setOrderData((prev) => ({
                ...prev,
                customer: { ...prev.customer, gender: g },
              }))
            }
          />
        );
      case 3:
        return (
          <PlaceOfSaleStep
            placeOfSale={orderData.placeOfSale}
            referralSource={orderData.referralSource}
            marketplaceName={orderData.marketplaceName}
            onInputChange={handleInputChange}
            salesChannels={salesChannels}
          />
        );
      case 4:
        return (
          <ItemsPricingStep
            orderData={orderData}
            currency={currency}
            setCurrency={setCurrency}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
            calculateSubtotal={calculateSubtotal}
            calculateTotal={calculateTotal}
            formatCurrency={formatCurrency}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setShowProductLookup={setShowProductLookup}
            setShowCostCalculator={setShowCostCalculator}
            handleSaveCosting={handleSaveCosting}
            onInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <OrderDetailsStep
            orderData={orderData}
            onInputChange={handleInputChange}
            salesChannels={salesChannels}
          />
        );
      case 6:
        return (
          <InvoicePreviewStep
            businessId={businessId}
            orderData={orderData}
            onNotesChange={(notes) =>
              setOrderData((prev) => ({ ...prev, notes }))
            }
            orderNumber={orderNumber}
            formatCurrency={formatCurrency}
            calculateSubtotal={calculateSubtotal}
            calculateTotal={calculateTotal}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled =
    (currentStep === 1 &&
      (!orderData.customer.name || !orderData.customer.phone)) ||
    (currentStep === 3 && !orderData.placeOfSale);

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/orders"
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">New Order</h1>
          <div className="w-8 h-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 mt-16">
        <StepIndicator currentStep={currentStep} />

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-3 mt-6">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 border border-gray-200 rounded-lg font-medium text-gray-600"
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}

          {currentStep < 6 ? (
            <button
              onClick={nextStep}
              disabled={isNextDisabled}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!orderData.deliveryDate || isSubmitting}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Order</span>
              )}
            </button>
          )}
        </div>
        <div className="h-10" />
      </div>

      {/* Modals */}
      {showCustomerLookup && (
        <CustomerLookup
          open={showCustomerLookup}
          onClose={() => setShowCustomerLookup(false)}
          onSelect={handleCustomerSelect}
          initialQuery={customerSearchQuery}
          allowBackdropClose={true}
        />
      )}

      {showProductLookup && (
        <ProductLookup
          open={showProductLookup}
          onClose={() => setShowProductLookup(false)}
          onSelect={handleProductSelect}
          initialQuery=""
          allowBackdropClose={true}
        />
      )}

      {showCostCalculator && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cost Calculator"
        >
          <div className="bg-white w-full max-w-md max-h-[90vh] rounded-2xl shadow-xl overflow-y-auto">
            <h3 className="p-3 flex justify-center text-l font-bold">
              Cost Calculator
            </h3>
            <Costing
              onClose={() => setShowCostCalculator(false)}
              showCurrencySelection={false}
              showHeader={false}
              onSave={handleSaveCosting}
              hideFields={["VAT", "Handling"]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
