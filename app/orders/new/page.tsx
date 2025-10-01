
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewOrderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    itemType: '',
    customItem: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      length: '',
      shoulders: '',
      sleeves: ''
    },
    fabric: '',
    color: '',
    specialRequests: '',
    deliveryDate: '',
    urgentOrder: false,
    estimatedPrice: '',
    depositAmount: '',
    paymentStatus: 'pending'
  });

  const itemTypes = [
    { id: 'wedding-dress', name: 'Wedding Dress', icon: 'ri-heart-line', price: 450 },
    { id: 'business-suit', name: 'Business Suit', icon: 'ri-briefcase-line', price: 320 },
    { id: 'evening-gown', name: 'Evening Gown', icon: 'ri-star-line', price: 380 },
    { id: 'casual-shirt', name: 'Casual Shirt', icon: 'ri-shirt-line', price: 85 },
    { id: 'formal-dress', name: 'Formal Dress', icon: 'ri-user-6-line', price: 280 },
    { id: 'custom', name: 'Custom Item', icon: 'ri-add-circle-line', price: 0 }
  ];

  const fabrics = [
    'Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Chiffon', 'Satin', 'Velvet', 'Denim', 'Lace'
  ];

  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Navy', value: '#1e3a8a' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Brown', value: '#a3a3a3' }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleItemTypeSelect = (item: any) => {
    setFormData(prev => ({
      ...prev,
      itemType: item.id,
      estimatedPrice: item.price.toString()
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step}
          </div>
          {step < 4 && (
            <div className={`w-8 h-0.5 ${
              step < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Customer Information</h2>
        <p className="text-sm text-gray-600">Enter customer details for the new order</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="+234 xxx xxx xxxx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.customerEmail}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="customer@email.com"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Item Selection</h2>
        <p className="text-sm text-gray-600">Choose the type of garment to create</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {itemTypes.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemTypeSelect(item)}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.itemType === item.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                formData.itemType === item.id
                  ? 'bg-indigo-100'
                  : 'bg-gray-100'
              }`}>
                <i className={`${item.icon} text-lg ${
                  formData.itemType === item.id
                    ? 'text-indigo-600'
                    : 'text-gray-600'
                }`}></i>
              </div>
              <p className={`text-sm font-medium ${
                formData.itemType === item.id
                  ? 'text-indigo-900'
                  : 'text-gray-900'
              }`}>{item.name}</p>
              {item.price > 0 && (
                <p className="text-xs text-gray-500 mt-1">${item.price}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {formData.itemType === 'custom' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom Item Description</label>
          <input
            type="text"
            value={formData.customItem}
            onChange={(e) => handleInputChange('customItem', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="Describe the custom item"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fabric</label>
          <select
            value={formData.fabric}
            onChange={(e) => handleInputChange('fabric', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">Select fabric</option>
            {fabrics.map((fabric) => (
              <option key={fabric} value={fabric}>{fabric}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Price</label>
          <input
            type="number"
            value={formData.estimatedPrice}
            onChange={(e) => handleInputChange('estimatedPrice', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="$0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleInputChange('color', color.name)}
              className={`relative w-12 h-12 rounded-lg border-2 ${
                formData.color === color.name
                  ? 'border-indigo-600'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: color.value }}
            >
              {formData.color === color.name && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Measurements</h2>
        <p className="text-sm text-gray-600">Enter customer measurements in inches</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chest</label>
          <input
            type="number"
            value={formData.measurements.chest}
            onChange={(e) => handleInputChange('measurements.chest', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Waist</label>
          <input
            type="number"
            value={formData.measurements.waist}
            onChange={(e) => handleInputChange('measurements.waist', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hips</label>
          <input
            type="number"
            value={formData.measurements.hips}
            onChange={(e) => handleInputChange('measurements.hips', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
          <input
            type="number"
            value={formData.measurements.length}
            onChange={(e) => handleInputChange('measurements.length', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shoulders</label>
          <input
            type="number"
            value={formData.measurements.shoulders}
            onChange={(e) => handleInputChange('measurements.shoulders', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sleeves</label>
          <input
            type="number"
            value={formData.measurements.sleeves}
            onChange={(e) => handleInputChange('measurements.sleeves', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-sm h-20"
          placeholder="Any special requirements or notes..."
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{formData.specialRequests.length}/500 characters</p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Details</h2>
        <p className="text-sm text-gray-600">Set delivery date and payment information</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date *</label>
        <input
          type="date"
          value={formData.deliveryDate}
          onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-sm"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="urgent"
          checked={formData.urgentOrder}
          onChange={(e) => handleInputChange('urgentOrder', e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
        />
        <label htmlFor="urgent" className="text-sm text-gray-700">
          Urgent Order (+20% rush fee)
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount</label>
          <input
            type="number"
            value={formData.depositAmount}
            onChange={(e) => handleInputChange('depositAmount', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="$0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
          <select
            value={formData.paymentStatus}
            onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial Payment</option>
            <option value="paid">Fully Paid</option>
          </select>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium">{formData.customerName || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Item:</span>
            <span className="font-medium">
              {formData.itemType === 'custom' 
                ? formData.customItem || 'Custom Item'
                : itemTypes.find(item => item.id === formData.itemType)?.name || 'Not selected'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fabric:</span>
            <span className="font-medium">{formData.fabric || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Color:</span>
            <span className="font-medium">{formData.color || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery:</span>
            <span className="font-medium">{formData.deliveryDate || 'Not set'}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Price:</span>
              <span className="font-semibold text-indigo-600">
                ${formData.estimatedPrice || '0'}
                {formData.urgentOrder && ' (+20%)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate order ID
      const orderId = `#ORD-${String(Date.now()).slice(-3).padStart(3, '0')}`;
      
      // Calculate final price with rush fee if urgent
      const basePrice = parseFloat(formData.estimatedPrice) || 0;
      const finalPrice = formData.urgentOrder ? basePrice * 1.2 : basePrice;
      
      // Create order object
      const newOrder = {
        id: orderId,
        customer: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        item: formData.itemType === 'custom' ? formData.customItem : 
              itemTypes.find(item => item.id === formData.itemType)?.name || 'Custom Item',
        status: 'Pending',
        amount: `$${finalPrice.toFixed(0)}`,
        date: new Date().toISOString().split('T')[0],
        deliveryDate: formData.deliveryDate,
        progress: 0,
        avatar: formData.customerName.split(' ').map(n => n[0]).join('').toUpperCase(),
        color: formData.color || 'blue',
        measurements: formData.measurements,
        fabric: formData.fabric,
        specialRequests: formData.specialRequests,
        urgentOrder: formData.urgentOrder,
        depositAmount: parseFloat(formData.depositAmount) || 0,
        paymentStatus: formData.paymentStatus
      };

      // Store in localStorage (in a real app, this would be sent to a backend)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Show success message
      alert(`Order ${orderId} created successfully for ${formData.customerName}!`);
      
      // Navigate back to orders page
      router.push('/orders');
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between">
          <Link href="/orders" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">New Order</h1>
          <div className="w-8 h-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 mt-16">
        {renderStepIndicator()}

        <div className="bg-white rounded-xl p-6 shadow-sm">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
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
          
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && (!formData.customerName || !formData.customerPhone)) ||
                (currentStep === 2 && !formData.itemType)
              }
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.deliveryDate || isSubmitting}
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
      </div>
    </div>
  );
}
