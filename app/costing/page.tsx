"use client";

import { useState } from "react";
import Link from "next/link";

export default function Costing({
  showCurrencySelection = true,
  showHeader = true,
  onSave = (items: any) => {},
  onClose = () => {},
  hideFields = [],
}) {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Fabric",
      cost: 0,
      quantity: 1,
      category: "Fabric & Main Materials",
    },
  ]);
  const [profit, setProfit] = useState(0);
  const [workmanship, setWorkmanship] = useState(0);
  const [handlingShipping, setHandlingShipping] = useState(0);
  const [vatRate, setVatRate] = useState(7.5); // Default VAT rate for Nigeria
  const [currency, setCurrency] = useState("USD");

  const handleSave = () => {
    const totalCost = items.reduce(
      (sum, item) => sum + item.cost * item.quantity,
      0
    );
    const overallCost = totalCost + profit + workmanship;

    onSave({ items, workmanship, profit, overallCost });
  };

  const categories = [
    "Fabric & Main Materials",
    "Sewing Essentials",
    "Embellishments & Decorative Materials",
    "Cutting & Measuring Tools",
    "Sewing Tools & Equipment",
    "Stitching & Holding Accessories",
    "Support & Reinforcement Materials",
    "Packaging & Labeling Materials",
  ];

  const categoryItems: Record<string, string[]> = {
    "Fabric & Main Materials": ["Fabric", "Lining", "Gum stay", "Net"],
    "Sewing Essentials": [
      "Thread",
      "Zippers",
      "Button",
      "Hooks & loop tape",
      "Machine oil",
    ],
    "Embellishments & Decorative Materials": [
      "Beads",
      "Rhinestones",
      "Embroidery thread",
      "Lace trims",
    ],
    "Cutting & Measuring Tools": ["Ruler", "Measuring tape", "Paper scissors"],
    "Sewing Tools & Equipment": [
      "Sewing machine",
      "Iron",
      "Cutting mat",
      "Rotary cutter",
    ],
    "Stitching & Holding Accessories": [
      "Pins",
      "Needles",
      "Machine needles",
      "Safety pins",
    ],
    "Support & Reinforcement Materials": [
      "Interfacing",
      "Boning",
      "Shoulder pads",
      "Elastic",
    ],
    "Packaging & Labeling Materials": [
      "Bags",
      "Labels",
      "Tissue paper",
      "Boxes",
    ],
  };

  const addItem = (category = "Fabric & Main Materials") => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: "",
        cost: 0,
        quantity: 1,
        category: category,
      },
    ]);
  };

  const addQuickItem = (itemName: string, category: string) => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: itemName,
        cost: 0,
        quantity: 1,
        category: category,
      },
    ]);
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalCost = items.reduce(
    (sum, item) => sum + item.cost * item.quantity,
    0
  );

  let subtotalWithProfitAndShipping = totalCost + profit + handlingShipping;

  if (!hideFields.includes("VAT")) {
    subtotalWithProfitAndShipping = totalCost + profit;
  }

  const vatAmount = (subtotalWithProfitAndShipping * vatRate) / 100;

  let totalWithVAT = subtotalWithProfitAndShipping;
  if (!hideFields.includes("VAT")) {
    totalWithVAT = subtotalWithProfitAndShipping + vatAmount;
  }

  const convertCurrency = (amount: number) => {
    if (currency === "NGN") {
      return (amount * 1650).toFixed(2);
    }
    return amount.toFixed(2);
  };

  const getCategoryTotal = (category: string) => {
    return items
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.cost * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {showHeader && (
        <div className="w-full bg-white z-50 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="w-8 h-8 flex items-center justify-center">
              <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
            </Link>
            <h1 className="font-semibold text-gray-800">Cost Calculator</h1>
            <div className="w-8 h-8"></div>
          </div>
        </div>
      )}

      <div className="pt-1 pb-20 px-4">
        {/* Currency Selector */}
        {showCurrencySelection && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currency === "USD"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("NGN")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currency === "NGN"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                NGN (₦)
              </button>
            </div>
          </div>
        )}

        {/* All Categories with Quick Add */}
        {categories.map((category) => (
          <div
            key={category}
            className="bg-white rounded-xl p-4 shadow-sm mb-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">{category}</h3>
              <button
                onClick={() => addItem(category)}
                className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"
              >
                <i className="ri-add-line text-white text-xs"></i>
              </button>
            </div>

            {/* Quick Add Items */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {categoryItems[category].map((itemName) => (
                <button
                  key={itemName}
                  onClick={() => addQuickItem(itemName, category)}
                  className="p-2 text-left text-xs bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  + {itemName}
                </button>
              ))}
            </div>

            {/* Category Items */}
            <div className="space-y-3">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                          className="w-full text-sm font-medium text-gray-800 border-none outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 flex items-center justify-center"
                      >
                        <i className="ri-close-line text-gray-400 text-sm"></i>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Cost per unit
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={item.cost}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "cost",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Yard(s)
                        </label>
                        <input
                          type="number"
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="text-sm text-gray-600">
                        Subtotal: {currency === "USD" ? "$" : "₦"}
                        {convertCurrency(item.cost * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}

              {items.filter((item) => item.category === category).length ===
                0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-xs">No items added yet</p>
                </div>
              )}
            </div>

            {/* Category Total */}
            {getCategoryTotal(category) > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Category Total:
                  </span>
                  <span className="font-semibold text-indigo-600">
                    {currency === "USD" ? "$" : "₦"}
                    {convertCurrency(getCategoryTotal(category))}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Additional Costs */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-medium text-gray-800 mb-4">Additional Costs</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Workmanship
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={workmanship}
                onChange={(e) =>
                  setWorkmanship(parseFloat(e.target.value) || 0)
                }
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Profit Margin
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={profit}
                onChange={(e) => setProfit(parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            {!hideFields.includes("Handling") && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Handling & Shipping
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={handlingShipping}
                  onChange={(e) =>
                    setHandlingShipping(parseFloat(e.target.value) || 0)
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            )}

            {!hideFields.includes("VAT") && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  VAT Rate (%)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="7.5"
                    value={vatRate}
                    onChange={(e) =>
                      setVatRate(parseFloat(e.target.value) || 0)
                    }
                    className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setVatRate(0)}
                      className={`px-3 py-2 rounded text-xs ${
                        vatRate === 0
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      0%
                    </button>
                    <button
                      onClick={() => setVatRate(7.5)}
                      className={`px-3 py-2 rounded text-xs ${
                        vatRate === 7.5
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      7.5%
                    </button>
                    <button
                      onClick={() => setVatRate(15)}
                      className={`px-3 py-2 rounded text-xs ${
                        vatRate === 15
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      15%
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-medium text-gray-800 mb-3">Cost Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Material Cost:</span>
              <span className="font-medium">
                {currency === "USD" ? "$" : "₦"}
                {convertCurrency(totalCost)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Workmanship:</span>
              <span className="font-medium">
                {currency === "USD" ? "$" : "₦"}
                {convertCurrency(workmanship)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Profit:</span>
              <span className="font-medium">
                {currency === "USD" ? "$" : "₦"}
                {convertCurrency(profit)}
              </span>
            </div>

            {!hideFields.includes("Handling") && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Handling & Shipping:</span>
                <span className="font-medium">
                  {currency === "USD" ? "$" : "₦"}
                  {convertCurrency(handlingShipping)}
                </span>
              </div>
            )}

            <div className="border-t pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {currency === "USD" ? "$" : "₦"}
                  {convertCurrency(subtotalWithProfitAndShipping)}
                </span>
              </div>
            </div>
            {!hideFields.includes("VAT") && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT ({vatRate}%):</span>
                <span className="font-medium">
                  {currency === "USD" ? "$" : "₦"}
                  {convertCurrency(vatAmount)}
                </span>
              </div>
            )}

            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">
                  Total Price:
                </span>
                <span className="font-bold text-indigo-600 text-lg">
                  {currency === "USD" ? "$" : "₦"}
                  {convertCurrency(totalWithVAT)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-1 rounded-lg font-medium"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-gray-800 text-white py-1 rounded-lg font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
