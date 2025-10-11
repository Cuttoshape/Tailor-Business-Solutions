"use client";

import Link from "next/link";
import React, { useMemo } from "react";
import { Measurement } from "./new/page";

type Gender = "male" | "female";

type MeasurementField = {
  key: string;
  label: string;
  unit: "inches" | string;
};

interface MeasurementDetailProps {
  measurement: Measurement;
  setShowDetail: (val: boolean) => void;
}

export default function MeasurementDetail({
  measurement,
  setShowDetail,
}: MeasurementDetailProps) {
  const { customer, measurements } = measurement;

  console.log("----customer-------", customer);

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
    customer?.gender === "female" ? femaleMeasurements : maleMeasurements;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto mb-20">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowDetail(false)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </button>
          <h1 className="font-semibold text-gray-800">
            Customer Measurement Details
          </h1>
          <div className="w-8 h-8" />
        </div>

        <div className="space-y-4 px-4">
          {/* Customer Info */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Customer Info</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {customer?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {customer?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">Gender:</span> {customer?.gender}
              </p>
              <p>
                <span className="font-medium">Age:</span>{" "}
                {customer?.age || "N/A"}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {customer?.phone || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {customer?.address || "N/A"}
              </p>
            </div>
          </div>

          {/* Dynamic Measurement Fields */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">
              Body Measurements{" "}
              {customer?.gender === "female" ? "(Female)" : "(Male)"}
            </h4>
            <div className="space-y-3">
              {activeMeasurements.map((m) => (
                <div
                  key={m.key}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {m.label}
                  </span>
                  <span className="text-sm text-gray-900">
                    {measurements[m.key] || "N/A"} {m.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowDetail(false)}
              className="flex-1 py-3 border border-gray-200 rounded-lg font-medium text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
