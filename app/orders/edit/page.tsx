"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import CustomerBioAddForm from "@/components/CustomerBioAddForm";
import CustomerLookup, { Customer } from "@/components/CustomerLookup";
import ProductLookup from "@/components/ProductLookup";
import { Product } from "@/app/inventory/page";
import BusinessBanner from "@/components/BusinessBanner";
import { femaleMeasurements, maleMeasurements } from "@/app/measurements/new/page";

export default function EditOrderPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [order, setOrder] = useState<any>(null);

  // Editable fields
  const [status, setStatus] = useState("pending");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [customerForm, setCustomerForm] = useState<any>({});
  const [measurementsForm, setMeasurementsForm] = useState<Record<string, string>>({});
  const [placeOfSale, setPlaceOfSale] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [marketplaceName, setMarketplaceName] = useState("");
  const [itemsForm, setItemsForm] = useState<Array<{
    id?: string;
    productId?: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    options?: any;
    fabricName: string;
    fabricPrice: string;
  }>>([]);
  const [currency, setCurrency] = useState("NGN");
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [showProductLookup, setShowProductLookup] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const activeMeasurements = {
    female: femaleMeasurements,
    male: maleMeasurements,
  } as const;

  const salesChannels = [
    { id: "walk-in", name: "Walk-in Store", icon: "ri-store-2-line", description: "Customer visited physical store" },
    { id: "instagram", name: "Instagram", icon: "ri-instagram-line", description: "Social media referral" },
    { id: "whatsapp", name: "WhatsApp", icon: "ri-whatsapp-line", description: "Direct messaging" },
    { id: "facebook", name: "Facebook", icon: "ri-facebook-line", description: "Facebook page or ads" },
    { id: "referral", name: "Customer Referral", icon: "ri-user-heart-line", description: "Referred by existing customer" },
    { id: "website", name: "Website", icon: "ri-global-line", description: "Online website inquiry" },
    { id: "phone", name: "Phone Call", icon: "ri-phone-line", description: "Direct phone contact" },
    { id: "marketplace", name: "Marketplace/Event", icon: "ri-calendar-event-line", description: "Trade show or market event" },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const resp: any = await apiClient.orders.getOne(String(orderId));
        const o = resp?.order || resp;
        setOrder(o);
        setStatus(o?.status || "pending");
        setDeliveryDate(o?.deliveryDate ? new Date(o.deliveryDate).toISOString().split("T")[0] : "");
        setNotes(o?.notes || "");
        setCustomerForm({
          id: o?.customer?.id || "",
          name: o?.customer?.name || "",
          email: o?.customer?.email || "",
          phone: o?.customer?.phone || "",
          address: o?.customer?.address || "",
          gender: o?.customer?.gender || "",
          age: o?.customer?.age?.toString?.() || "",
        });
        setMeasurementsForm(o?.measurements || {});
        setPlaceOfSale(o?.placeOfSale || "");
        setReferralSource(o?.referralSource || "");
        setMarketplaceName(o?.marketplaceName || "");
        setItemsForm(
          Array.isArray(o?.items)
            ? o.items.map((it: any) => ({
                id: it.id,
                productId: it.productId,
                productName: it.productName,
                quantity: Number(it.quantity) || 1,
                unitPrice: Number(it.unitPrice) || 0,
                options: it.specifications || {},
                fabricName: it?.specifications?.fabricTypes?.[0]?.name || "",
                fabricPrice: String(it?.specifications?.fabricTypes?.[0]?.cost ?? ""),
              }))
            : []
        );
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    void fetchOrder();
  }, [orderId]);

  const itemsSubtotal = useMemo(
    () => itemsForm.reduce((sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 0), 0),
    [itemsForm]
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);

  const vatRate = Number(order?.vatOrTax || 0);
  const shippingCost = Number(order?.shippingCost || 0);
  const vatAmount = (vatRate * itemsSubtotal) / 100;
  const totalAmountCalc = itemsSubtotal + shippingCost + vatAmount;

  const handleCustomerSelect = (cust: Customer) => {
    setCustomerForm((prev: any) => ({
      ...prev,
      id: cust.id?.toString?.() || prev.id,
      name: cust.name || "",
      email: cust.email || "",
      phone: cust.phone || "",
      address: cust.address || "",
      gender: cust.gender || prev.gender,
      age: cust.age?.toString?.() || prev.age,
    }));
    setShowCustomerLookup(false);
    setCustomerSearchQuery("");
  };

  const handleProductSelect = (product: Product) => {
    if (currentIndex === null) return;
    const { name, lowPrice, options, id } = product;
    setItemsForm((prev) =>
      prev.map((it, i) =>
        i === currentIndex
          ? {
              ...it,
              productName: name,
              productId: id?.toString?.(),
              unitPrice: Number(lowPrice) || 0,
              options,
              ...(Array.isArray((options as any)?.fabricTypes) && (options as any).fabricTypes.length > 0
                ? {
                    fabricName: (options as any).fabricTypes[0].name || "",
                    fabricPrice: String((options as any).fabricTypes[0].cost ?? ""),
                  }
                : {}),
            }
          : it
      )
    );
    setShowProductLookup(false);
  };

  const save = async () => {
    if (!orderId) return;
    try {
      setSaving(true);
      await apiClient.orders.update(String(orderId), {
        status,
        deliveryDate,
        notes,
      });
      router.push("/orders");
    } catch {
      // noop
    } finally {
      setSaving(false);
    }
  };

  const next = () => setCurrentStep((s) => Math.min(6, s + 1));
  const prev = () => setCurrentStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between">
          <Link href="/orders" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Edit Order</h1>
          <div className="w-8 h-8"></div>
        </div>
      </div>

      <div className="px-4 py-6 mt-16">
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-1 mb-6">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                  s <= currentStep ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 6 && (
                <div className={`w-6 h-0.5 ${s < currentStep ? "bg-indigo-600" : "bg-gray-200"}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm min-h-[60vh]">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : !order ? (
            <div className="p-6 text-center text-red-600">Order not found or no id provided.</div>
          ) : (
            <div className="space-y-4">
              {currentStep === 1 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Customer Information</h4>
                  <div className="flex space-x-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomerLookup(true)}
                      className="py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm flex items-center justify-center space-x-2"
                    >
                      <i className="ri-search-line"></i>
                      <span>Find Customer</span>
                    </button>
                  </div>
                  <CustomerBioAddForm customer={order.customer} formData={customerForm} setFormData={setCustomerForm} />
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">
                    Body Measurements {customerForm.gender === "female" ? "(Female)" : "(Male)"}
                  </h4>
                  <div className="space-y-3">
                    {customerForm.gender &&
                      activeMeasurements[customerForm.gender as "female" | "male"]?.map((m) => (
                        <div key={m.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{m.label}</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.1"
                              className="w-full p-3 pr-16 border border-gray-200 rounded-lg text-sm"
                              placeholder="0.0"
                              value={measurementsForm[m.key] ?? ""}
                              onChange={(e) =>
                                setMeasurementsForm((prev) => ({ ...prev, [m.key]: e.currentTarget.value }))
                              }
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                              {m.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Place of Sale</h2>
                    <p className="text-sm text-gray-600">How did this customer find you?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {salesChannels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setPlaceOfSale(channel.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          placeOfSale === channel.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              placeOfSale === channel.id ? "bg-indigo-100" : "bg-gray-100"
                            }`}
                          >
                            <i className={`${channel.icon} text-lg ${placeOfSale === channel.id ? "text-indigo-600" : "text-gray-600"}`}></i>
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${placeOfSale === channel.id ? "text-indigo-900" : "text-gray-900"}`}>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Referral Source</label>
                      <input
                        type="text"
                        value={referralSource}
                        onChange={(e) => setReferralSource(e.currentTarget.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                        placeholder="Who referred this customer?"
                      />
                    </div>
                  )}

                  {placeOfSale === "marketplace" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marketplace/Event Name</label>
                      <input
                        type="text"
                        value={marketplaceName}
                        onChange={(e) => setMarketplaceName(e.currentTarget.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                        placeholder="Enter marketplace or event name"
                      />
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Items & Pricing</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrency("NGN")}
                        className={`px-3 py-1 rounded text-sm ${
                          currency === "NGN" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        NGN
                      </button>
                      <button
                        onClick={() => setCurrency("USD")}
                        className={`px-3 py-1 rounded text-sm ${
                          currency === "USD" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        USD
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {itemsForm.map((it, idx) => (
                      <div key={it.id || idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex justify-between items-center w-full">
                            <h4 className="font-medium text-gray-800">{it.productName || `Item ${idx + 1}`}</h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setCurrentIndex(idx);
                                  setShowProductLookup(true);
                                }}
                                className="py-2 px-3 bg-indigo-50 text-indigo-600 rounded-lg text-sm"
                              >
                                Find Product
                              </button>
                              {itemsForm.length > 1 && (
                                <button
                                  onClick={() => setItemsForm((prev) => prev.filter((_, i) => i !== idx))}
                                  className="w-8 h-8 flex items-center justify-center text-red-500"
                                  title="Remove item"
                                >
                                  <i className="ri-delete-bin-line text-sm"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={it.quantity}
                              onChange={(e) =>
                                setItemsForm((prev) =>
                                  prev.map((x, i) => (i === idx ? { ...x, quantity: parseInt(e.currentTarget.value) || 1 } : x))
                                )
                              }
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Unit Price</label>
                            <input
                              type="number"
                              min="0"
                              value={it.unitPrice}
                              onChange={(e) =>
                                setItemsForm((prev) =>
                                  prev.map((x, i) => (i === idx ? { ...x, unitPrice: parseFloat(e.currentTarget.value) || 0 } : x))
                                )
                              }
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            />
                          </div>
                        </div>
                        {/* Fabric selection similar to create */}
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fabric</label>
                            {(() => {
                              const fabricTypes = (it as any)?.options?.fabricTypes as
                                | Array<{ name: string; cost: number | string }>
                                | undefined;
                              const list = Array.isArray(fabricTypes) ? fabricTypes : [];
                              return (
                                <select
                                  value={it.fabricName}
                                  onChange={(e) => {
                                    const name = e.target.value;
                                    setItemsForm((prev) =>
                                      prev.map((x, i) =>
                                        i === idx ? { ...x, fabricName: name } : x
                                      )
                                    );
                                    const found = list.find((f) => f.name === name);
                                    if (found) {
                                      setItemsForm((prev) =>
                                        prev.map((x, i) =>
                                          i === idx ? { ...x, fabricPrice: String(found.cost ?? "") } : x
                                        )
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Price</label>
                            <input
                              type="number"
                              value={it.fabricPrice}
                              onChange={(e) =>
                                setItemsForm((prev) =>
                                  prev.map((x, i) => (i === idx ? { ...x, fabricPrice: e.currentTarget.value } : x))
                                )
                              }
                              className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                              placeholder="$0"
                            />
                          </div>
                        </div>
                        <div className="flex text-right text-sm font-medium text-gray-700 justify-between items-center mt-2">
                          <span />
                          Subtotal: {formatCurrency(it.unitPrice * it.quantity)}
                        </div>
                      </div>
                    ))}
                    {itemsForm.length === 0 && (
                      <div className="text-sm text-gray-500">No items.</div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setItemsForm((prev) => [
                        ...prev,
                        {
                          productName: "",
                          productId: "",
                          quantity: 1,
                          unitPrice: 0,
                          options: {},
                          fabricName: "",
                          fabricPrice: "",
                        },
                      ])
                    }
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium"
                  >
                    + Add Another Item
                  </button>

                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span>{formatCurrency(itemsSubtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{formatCurrency(shippingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT/Tax:</span>
                        <span>{formatCurrency(vatAmount)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg text-indigo-600">
                          <span>Total:</span>
                          <span>{formatCurrency(totalAmountCalc)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Order Details</h4>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.currentTarget.value)}
                      className="w-full p-2 border border-gray-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.currentTarget.value)}
                      className="w-full p-2 border border-gray-200 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="measuring">Measuring</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.currentTarget.value)}
                      className="w-full p-2 border border-gray-200 rounded min-h-[80px]"
                      placeholder="Add order notes..."
                    />
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Invoice Preview</h2>

                  <div className="mb-2">
                    {order.customer?.businessId && (
                      <BusinessBanner businessId={String(order.customer.businessId)} />
                    )}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">PROFORMA INVOICE</h2>
                      <p className="text-gray-600">{order.orderNumber}</p>
                      <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                        <p className="text-gray-700">{customerForm.name}</p>
                        <p className="text-gray-600 text-sm">{customerForm.email}</p>
                        <p className="text-gray-600 text-sm">{customerForm.phone}</p>
                        {customerForm.address && (
                          <p className="text-gray-600 text-sm mt-1">{customerForm.address}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="mb-2">
                          <span className="text-gray-600 text-sm">Delivery: </span>
                          <span className="font-medium">{new Date(deliveryDate || order.deliveryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 text-sm font-semibold text-gray-900">Item</th>
                            <th className="text-center py-2 text-sm font-semibold text-gray-900">Qty</th>
                            <th className="text-right py-2 text-sm font-semibold text-gray-900">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemsForm.map((it, idx) => (
                            <tr key={it.id || idx} className="border-b border-gray-100">
                              <td className="py-3">
                                <div className="font-medium text-gray-900">{it.productName}</div>
                              </td>
                              <td className="text-center py-3 text-gray-700">{it.quantity}</td>
                              <td className="text-right py-3 font-medium text-gray-900">{formatCurrency(it.quantity * it.unitPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-end">
                        <div className="w-64">
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">{formatCurrency(itemsSubtotal)}</span>
                          </div>
                          {shippingCost > 0 && (
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">Shipping:</span>
                              <span className="font-medium">{formatCurrency(shippingCost)}</span>
                            </div>
                          )}
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">VAT/TAX:</span>
                            <span className="font-medium">{formatCurrency(vatAmount)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-lg font-bold text-gray-900">Total:</span>
                              <span className="text-lg font-bold text-indigo-600">{formatCurrency(totalAmountCalc)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {currentStep > 1 && (
                  <button onClick={prev} className="flex-1 py-3 border border-gray-200 rounded-lg">Previous</button>
                )}
                {currentStep < 6 ? (
                  <button onClick={next} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg">Next</button>
                ) : (
                  <button
                    onClick={save}
                    disabled={saving}
                    className={`flex-1 py-3 rounded-lg ${saving ? "bg-gray-300" : "bg-green-600 text-white"}`}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
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
    </div>
  );
}


