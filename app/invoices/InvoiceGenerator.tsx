"use client";

import CustomerLookup, { Customer } from "@/components/CustomerLookup";
import { useState, useEffect } from "react";

interface InvoiceGeneratorProps {
  onClose: () => void;
  existingInvoice?: any;
}

export default function InvoiceGenerator({
  onClose,
  existingInvoice,
}: InvoiceGeneratorProps) {
  const [step, setStep] = useState(1);
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [currency, setCurrency] = useState("NGN");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    items: [{ name: "", description: "", quantity: 1, price: 0 }],
    shippingCost: 0,
    profit: 0,
    estimatedDelivery: "",
    notes: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });

  useEffect(() => {
    if (existingInvoice) {
      setInvoiceData({
        customerName: existingInvoice.customerName,
        customerEmail: existingInvoice.customerEmail,
        customerPhone: existingInvoice.customerPhone,
        customerAddress: existingInvoice.customerAddress || "",
        items: existingInvoice.items,
        shippingCost: 0,
        profit: 0,
        estimatedDelivery: existingInvoice.estimatedDelivery,
        notes: "",
        issueDate: existingInvoice.issueDate,
        expiryDate: existingInvoice.expiryDate,
      });
    }
  }, [existingInvoice]);

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", description: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() + invoiceData.shippingCost + invoiceData.profit;
  };

  const convertCurrency = (amount: number) => {
    if (currency === "NGN") {
      return amount;
    }
    return (amount / 1650).toFixed(2); // Example conversion rate
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);

    setShowCustomerLookup(false);
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `INV-${year}-${month}${random}`;
  };

  const sendViaEmail = () => {
    const subject = `Proforma Invoice - ${generateInvoiceNumber()}`;
    const body = `Dear ${invoiceData.customerName},

Please find attached your proforma invoice for the following items:

${invoiceData.items
  .map(
    (item) =>
      `- ${item.name} (Qty: ${item.quantity}) - ${formatCurrency(
        item.price * item.quantity
      )}`
  )
  .join("\n")}

Total Amount: ${formatCurrency(calculateTotal())}
Estimated Delivery: ${new Date(
      invoiceData.estimatedDelivery
    ).toLocaleDateString()}

Thank you for your business!

Best regards,
Cuttoshape`;

    const mailtoLink = `mailto:${
      invoiceData.customerEmail
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const sendViaWhatsApp = () => {
    const message = `Hello ${invoiceData.customerName}! 

Here's your proforma invoice:

📋 *Invoice: ${generateInvoiceNumber()}*

*Items:*
${invoiceData.items
  .map(
    (item) =>
      `• ${item.name} (${item.quantity}x) - ${formatCurrency(
        item.price * item.quantity
      )}`
  )
  .join("\n")}

💰 *Total: ${formatCurrency(calculateTotal())}*
🚚 *Delivery: ${new Date(invoiceData.estimatedDelivery).toLocaleDateString()}*

Thank you for choosing Cuttoshape! 🪡✂️`;

    const whatsappLink = `https://wa.me/${invoiceData.customerPhone.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </button>
          <h1 className="font-semibold text-gray-800">
            {existingInvoice ? "Edit Invoice" : "Create Invoice"}
          </h1>
          <div className="w-8 h-8"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              step >= 2 ? "bg-indigo-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              step >= 3 ? "bg-indigo-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Customer</span>
          <span>Items</span>
          <span>Preview</span>
        </div>
      </div>

      <div className="px-4 pb-20">
        {/* Step 1: Customer Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>

            <button
              onClick={() => setShowCustomerLookup(true)}
              className="flex-1 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm flex items-center justify-center space-x-2"
            >
              <i className="ri-search-line"></i>
              <span>Find Existing Customer</span>
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={invoiceData.customerName}
                onChange={(e) =>
                  setInvoiceData((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={invoiceData.customerEmail}
                onChange={(e) =>
                  setInvoiceData((prev) => ({
                    ...prev,
                    customerEmail: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="customer@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={invoiceData.customerPhone}
                onChange={(e) =>
                  setInvoiceData((prev) => ({
                    ...prev,
                    customerPhone: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="+234 xxx xxx xxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                value={invoiceData.customerAddress}
                onChange={(e) =>
                  setInvoiceData((prev) => ({
                    ...prev,
                    customerAddress: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-200 rounded-lg h-20"
                placeholder="Enter delivery address"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={invoiceData.issueDate}
                  onChange={(e) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      issueDate: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={invoiceData.expiryDate}
                  onChange={(e) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={
                !invoiceData.customerName ||
                !invoiceData.customerEmail ||
                !invoiceData.customerPhone
              }
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
            >
              Next: Add Items
            </button>
          </div>
        )}

        {/* Step 2: Items and Pricing */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Items & Pricing
              </h2>
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

            {/* Items */}
            <div className="space-y-3">
              {invoiceData.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">
                      Item {index + 1}
                    </h4>
                    {invoiceData.items.length > 1 && (
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
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
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

                    <div className="text-right text-sm font-medium text-gray-700">
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
              <h4 className="font-medium text-gray-800 mb-3">
                Additional Costs
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Shipping Cost
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={invoiceData.shippingCost}
                    onChange={(e) =>
                      setInvoiceData((prev) => ({
                        ...prev,
                        shippingCost: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Profit Margin
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={invoiceData.profit}
                    onChange={(e) =>
                      setInvoiceData((prev) => ({
                        ...prev,
                        profit: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full p-2 border border-gray-200 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Delivery Date
              </label>
              <input
                type="date"
                value={invoiceData.estimatedDelivery}
                onChange={(e) =>
                  setInvoiceData((prev) => ({
                    ...prev,
                    estimatedDelivery: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
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
                  <span>{formatCurrency(invoiceData.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit:</span>
                  <span>{formatCurrency(invoiceData.profit)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg text-indigo-600">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium"
              >
                Preview
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview and Send */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Invoice Preview
            </h2>

            {/* Invoice Preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <h1 className="font-['Pacifico'] text-2xl text-indigo-600 mb-2">
                  Cuttoshape
                </h1>
                <h2 className="text-xl font-bold text-gray-900">
                  PROFORMA INVOICE
                </h2>
                <p className="text-gray-600">{generateInvoiceNumber()}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <p className="text-gray-700">{invoiceData.customerName}</p>
                  <p className="text-gray-600 text-sm">
                    {invoiceData.customerEmail}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {invoiceData.customerPhone}
                  </p>
                  {invoiceData.customerAddress && (
                    <p className="text-gray-600 text-sm mt-1">
                      {invoiceData.customerAddress}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <span className="text-gray-600 text-sm">Issue Date: </span>
                    <span className="font-medium">
                      {new Date(invoiceData.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600 text-sm">Expiry Date: </span>
                    <span className="font-medium">
                      {new Date(invoiceData.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Delivery: </span>
                    <span className="font-medium">
                      {new Date(
                        invoiceData.estimatedDelivery
                      ).toLocaleDateString()}
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
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3">
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
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
                    {invoiceData.shippingCost > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          {formatCurrency(invoiceData.shippingCost)}
                        </span>
                      </div>
                    )}
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
                value={invoiceData.notes}
                onChange={(e) =>
                  setInvoiceData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="w-full p-3 border border-gray-200 rounded-lg h-20"
                placeholder="Add any additional notes or terms..."
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={sendViaEmail}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <i className="ri-mail-line"></i>
                  <span>Send via Email</span>
                </button>
                <button
                  onClick={sendViaWhatsApp}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <i className="ri-whatsapp-line"></i>
                  <span>Send via WhatsApp</span>
                </button>
              </div>

              <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
                <i className="ri-download-line"></i>
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium"
              >
                Back to Edit
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Customer Lookup Modal */}
      {showCustomerLookup && (
        <CustomerLookup
          open={showCustomerLookup}
          onClose={() => setShowCustomerLookup(false)}
          onSelect={handleCustomerSelect}
          initialQuery=""
          allowBackdropClose={true}
        />
      )}
    </div>
  );
}
