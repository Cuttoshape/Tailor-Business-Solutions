
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Measurements() {
  const [activeTab, setActiveTab] = useState('automatic');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGender, setSelectedGender] = useState('female');

  const femaleMeasurements = [
    { key: 'neck', label: 'Neck (round)', unit: 'inches' },
    { key: 'shoulder', label: 'Shoulder', unit: 'inches' },
    { key: 'bust', label: 'Bust', unit: 'inches' },
    { key: 'chest', label: 'Chest', unit: 'inches' },
    { key: 'shoulderToUnderBust', label: 'Shoulder to Under Bust', unit: 'inches' },
    { key: 'longSleeve', label: 'Long Sleeve', unit: 'inches' },
    { key: 'shortSleeve', label: 'Short Sleeve', unit: 'inches' },
    { key: 'waist', label: 'Waist', unit: 'inches' },
    { key: 'hips', label: 'Hips', unit: 'inches' },
    { key: 'thigh', label: 'Thigh', unit: 'inches' },
    { key: 'halfBodyToWaist', label: 'Half Body Length (Neckline to waistline)', unit: 'inches' },
    { key: 'halfBodyToButtock', label: 'Half Body Length (Neckline to below buttock line)', unit: 'inches' },
    { key: 'bodyToKnee', label: 'Body Length (Neckline to the back of the knee)', unit: 'inches' },
    { key: 'fullBodyLength', label: 'Full Body Length (Neckline to the ankle)', unit: 'inches' },
    { key: 'trouserLength', label: 'Trouser Length (to the ankle or knee for knickers)', unit: 'inches' }
  ];

  const maleMeasurements = [
    { key: 'head', label: 'Head', unit: 'inches' },
    { key: 'neck', label: 'Neck (round)', unit: 'inches' },
    { key: 'upperBodyToButtock', label: 'Upper Body Length (Neckline to below buttock line)', unit: 'inches' },
    { key: 'upperBodyToKnee', label: 'Upper Body Length (Neckline to the knee)', unit: 'inches' },
    { key: 'fullBodyLength', label: 'Full Body Length (Neckline to the ankle)', unit: 'inches' },
    { key: 'shoulder', label: 'Shoulder (shoulder to shoulder)', unit: 'inches' },
    { key: 'longSleeve', label: 'Long Sleeve (from the shoulder socket/Arm hole to the wrist)', unit: 'inches' },
    { key: 'shortSleeve', label: 'Short Sleeve (from the shoulder socket/Arm hole to the elbow)', unit: 'inches' },
    { key: 'cufflinkArea', label: 'Cufflink Area (same as wrist hole)', unit: 'inches' },
    { key: 'chest', label: 'Chest (round the chest area to the back)', unit: 'inches' },
    { key: 'roundBody', label: 'Round Body (Tummy)', unit: 'inches' },
    { key: 'trouserLength', label: 'Trouser Length (to the ankle or knee for knickers)', unit: 'inches' },
    { key: 'waist', label: 'Waist (Above bottom)', unit: 'inches' },
    { key: 'hip', label: 'Hip (round the bottom)', unit: 'inches' },
    { key: 'thigh', label: 'Thigh (of one leg)', unit: 'inches' }
  ];

  const [measurementData, setMeasurementData] = useState({});

  const handleMeasurementChange = (key: string, value: string) => {
    setMeasurementData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
          <h1 className="font-semibold text-gray-800">Body Measurements</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center"
          >
            <i className="ri-add-line text-white text-sm"></i>
          </button>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* Tab Switcher */}
        <div className="px-4 py-4">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab('automatic')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                activeTab === 'automatic' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Automatic
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                activeTab === 'manual' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Automatic Tab */}
        {activeTab === 'automatic' && (
          <div className="px-4 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <img 
                  src="https://readdy.ai/api/search-image?query=3D%20illustration%20of%20body%20measurement%20scanning%20technology%2C%20modern%20digital%20measuring%20system%2C%20clean%20white%20background%2C%20professional%20medical%20equipment%20style%2C%20high%20detail%20quality%2C%20centered%20composition&width=200&height=150&seq=auto1&orientation=landscape"
                  alt="Automatic Measurement"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-gray-800 mb-2">Automatic Measurement</h3>
                <p className="text-sm text-gray-600">Receive customer measurements automatically with orders</p>
              </div>
              
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium">
                Enable Auto Measurement
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">Recent Auto Measurements</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">SJ</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">With order #1234</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">MC</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Mike Chen</p>
                      <p className="text-xs text-gray-500">Shared measurement</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Tab */}
        {activeTab === 'manual' && (
          <div className="px-4 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">Manual Measurements</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">ED</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Emma Davis</p>
                      <p className="text-xs text-gray-500">Manual entry - On spot</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-600">JW</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">John Wilson</p>
                      <p className="text-xs text-gray-500">Manual with order</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-4">
                <img 
                  src="https://readdy.ai/api/search-image?query=icon%2C%20measuring%20tape%20with%20notepad%2C%203D%20cartoon%20style%2C%20vibrant%20colors%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20clean%20modern%20look&width=100&height=100&seq=manual1&orientation=squarish"
                  alt="Manual Entry"
                  className="w-20 h-20 mx-auto object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium text-gray-800">Quick Manual Entry</h3>
                <p className="text-sm text-gray-600 mt-1">Add measurements on the go</p>
              </div>
              
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium"
              >
                Add Manual Measurement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">Add Customer Measurement</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGender('female')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        selectedGender === 'female'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGender('male')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        selectedGender === 'male'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Male
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input 
                    type="number" 
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    placeholder="Age"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea 
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm h-20"
                  placeholder="Customer address"
                  maxLength={500}
                ></textarea>
              </div>

              {/* Dynamic Measurement Fields */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">
                  Body Measurements - {selectedGender === 'female' ? 'Female' : 'Male'}
                </h4>
                <div className="space-y-3">
                  {(selectedGender === 'female' ? femaleMeasurements : maleMeasurements).map((measurement) => (
                    <div key={measurement.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {measurement.label}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-3 pr-16 border border-gray-200 rounded-lg text-sm"
                          placeholder="0.0"
                          value={measurementData[measurement.key] || ''}
                          onChange={(e) => handleMeasurementChange(measurement.key, e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          {measurement.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-medium text-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-4 py-2">
        <div className="grid grid-cols-5 gap-1">
          <Link href="/" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-home-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </Link>
          
          <Link href="/measurements" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-ruler-line text-indigo-600 text-lg"></i>
            </div>
            <span className="text-xs text-indigo-600 font-medium mt-1">Measure</span>
          </Link>
          
          <Link href="/orders" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-shopping-bag-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Orders</span>
          </Link>
          
          <Link href="/customers" className="flex flex-col items-center py-2 px-1">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-group-line text-gray-400 text-lg"></i>
            </div>
            <span className="text-xs text-gray-400 mt-1">Customers</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center py-2 px-1">
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
