"use client";

import CustomerBioAddForm from "@/components/CustomerBioAddForm";
import CustomerLookup, { Customer } from "@/components/CustomerLookup";
import apiClient from "@/lib/api";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

type Gender = "male" | "female";

type MeasurementField = {
  key: string;
  label: string;
  unit: "inches" | string;
};

interface CustomerForm {
  name: string;
  email: string;
  gender: Gender;
  age?: number | "";
  address?: string;
}

export default function MeasurementForm({
  setShowAddForm,
}: {
  setShowAddForm: (val: boolean) => void;
}) {
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [formData, setFormData] = useState<CustomerForm>({
    name: "",
    email: "",
    gender: "female", // default
    age: "",
    address: "",
  });
  const [measurementData, setMeasurementData] = useState<
    Record<string, string>
  >({});
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);

  const femaleMeasurements: MeasurementField[] = [
    { key: "neck", label: "Neck (round)", unit: "inches" },
    { key: "shoulder", label: "Shoulder", unit: "inches" },
    { key: "bust", label: "Bust", unit: "inches" },
    { key: "chest", label: "Chest", unit: "inches" },
    {
      key: "shoulderToUnderBust",
      label: "Shoulder to Under Bust",
      unit: "inches",
    },
    { key: "longSleeve", label: "Long Sleeve", unit: "inches" },
    { key: "shortSleeve", label: "Short Sleeve", unit: "inches" },
    { key: "waist", label: "Waist", unit: "inches" },
    { key: "hips", label: "Hips", unit: "inches" },
    { key: "thigh", label: "Thigh", unit: "inches" },
    {
      key: "halfBodyToWaist",
      label: "Half Body Length (Neckline to waistline)",
      unit: "inches",
    },
    {
      key: "halfBodyToButtock",
      label: "Half Body Length (Neckline to below buttock line)",
      unit: "inches",
    },
    {
      key: "bodyToKnee",
      label: "Body Length (Neckline to the back of the knee)",
      unit: "inches",
    },
    {
      key: "fullBodyLength",
      label: "Full Body Length (Neckline to the ankle)",
      unit: "inches",
    },
    {
      key: "trouserLength",
      label: "Trouser Length (to the ankle or knee for knickers)",
      unit: "inches",
    },
  ];

  const maleMeasurements: MeasurementField[] = [
    { key: "head", label: "Head", unit: "inches" },
    { key: "neck", label: "Neck (round)", unit: "inches" },
    {
      key: "upperBodyToButtock",
      label: "Upper Body Length (Neckline to below buttock line)",
      unit: "inches",
    },
    {
      key: "upperBodyToKnee",
      label: "Upper Body Length (Neckline to the knee)",
      unit: "inches",
    },
    {
      key: "fullBodyLength",
      label: "Full Body Length (Neckline to the ankle)",
      unit: "inches",
    },
    {
      key: "shoulder",
      label: "Shoulder (shoulder to shoulder)",
      unit: "inches",
    },
    {
      key: "longSleeve",
      label: "Long Sleeve (from the shoulder socket/Arm hole to the wrist)",
      unit: "inches",
    },
    {
      key: "shortSleeve",
      label: "Short Sleeve (from the shoulder socket/Arm hole to the elbow)",
      unit: "inches",
    },
    {
      key: "cufflinkArea",
      label: "Cufflink Area (same as wrist hole)",
      unit: "inches",
    },
    {
      key: "chest",
      label: "Chest (round the chest area to the back)",
      unit: "inches",
    },
    { key: "roundBody", label: "Round Body (Tummy)", unit: "inches" },
    {
      key: "trouserLength",
      label: "Trouser Length (to the ankle or knee for knickers)",
      unit: "inches",
    },
    { key: "waist", label: "Waist (Above bottom)", unit: "inches" },
    { key: "hip", label: "Hip (round the bottom)", unit: "inches" },
    { key: "thigh", label: "Thigh (of one leg)", unit: "inches" },
  ];

  const activeMeasurements =
    formData.gender === "female" ? femaleMeasurements : maleMeasurements;

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    // optionally prefill
    setFormData((prev) => ({
      ...prev,
      name: customer.name ?? prev.name,
      email: customer.email ?? prev.email,
    }));
    setShowCustomerLookup(false);
  };

  const handleMeasurementChange = (key: string, value: string) => {
    setMeasurementData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveMeasurement = async () => {
    // Compose payload to your API shape
    const payload = {
      customer: {
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        age: formData.age === "" ? undefined : Number(formData.age),
        address: formData.address,
        id: selectedCustomer?.id,
      },
      measurements: measurementData, // as keyed values in inches
    };

    try {
      await apiClient.customers.create(payload);
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to save measurement:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/measurements"
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
          <h1 className="font-semibold text-gray-800">
            Add Customer Measurement
          </h1>
          <div className="w-8 h-8" />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowCustomerLookup(true)}
            className="flex-1 mt-1 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg font-medium text-sm flex items-center justify-center space-x-2"
          >
            <i className="ri-search-line" />
            <span>Find Existing Customer</span>
          </button>

          <CustomerBioAddForm
            customer={selectedCustomer}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Dynamic Measurement Fields */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">
              Body Measurements{" "}
              {formData.gender === "female" ? "(Female)" : "(Male)"}
            </h4>
            <div className="space-y-3">
              {activeMeasurements.map((m) => (
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
                      value={measurementData[m.key] ?? ""}
                      onChange={(e) =>
                        handleMeasurementChange(m.key, e.target.value)
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

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-3 border border-gray-200 rounded-lg font-medium text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMeasurement}
              type="button"
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium"
            >
              Save Measurement
            </button>
          </div>
        </div>
      </div>

      <CustomerLookup
        open={showCustomerLookup}
        onClose={() => setShowCustomerLookup(false)}
        onSelect={handleCustomerSelect}
        initialQuery=""
        allowBackdropClose={true}
      />
    </div>
  );
}
