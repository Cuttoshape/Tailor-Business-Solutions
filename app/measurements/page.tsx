"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";
import MeasurementDetail from "./MeasurementDetailModal";
import { Measurement } from "./new/page";

export default function Measurements() {
  const [activeTab, setActiveTab] = useState("manual");
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<Measurement | null>(null);
  const [businessId, setBusinessId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const raw =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = raw ? (JSON.parse(raw) as { businessId?: string }) : null;

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const result: any = await apiClient.measurements.getBusinessMeasurements({
        businessId: businessId,
        search: searchQuery,
        page: page.toString(),
        limit: "20",
      });

      setMeasurements(result.measurements || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setMeasurements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.businessId) {
      setBusinessId(user.businessId);
    }
  }, [user]);

  useEffect(() => {
    if (businessId) fetchMeasurements();
  }, [searchQuery, page, businessId]);

  console.log("----measurements----- ", measurements);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-left-line text-gray-600 text-lg"></i>
          </Link>
          <h1 className="font-semibold text-gray-800">Body Measurements</h1>
          <Link
            href="/measurements/new"
            className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center"
          >
            <i className="ri-add-line text-white text-sm"></i>
          </Link>
        </div>
      </div>

      <div className="pt-16 pb-20">
        {/* Tab Switcher */}
        <div className="px-4 py-4">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                activeTab === "manual"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setActiveTab("automatic")}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                activeTab === "automatic"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Automatic
            </button>
          </div>
        </div>

        {/* Automatic Tab */}
        {activeTab === "automatic" && (
          <div className="px-4 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                {/* <img
                  src="https://readdy.ai/api/search-image?query=3D%20illustration%20of%20body%20measurement%20scanning%20technology%2C%20modern%20digital%20measuring%20system%2C%20clean%20white%20background%2C%20professional%20medical%20equipment%20style%2C%20high%20detail%20quality%2C%20centered%20composition&width=200&height=150&seq=auto1&orientation=landscape"
                  alt="Automatic Measurement"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                /> */}
                <h3 className="font-semibold text-gray-800 mb-2">
                  Automatic Measurement
                </h3>
                <p className="text-sm text-gray-600">
                  Receive customer measurements automatically with orders
                </p>
              </div>

              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium">
                Enable Auto Measurement
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">
                Recent Auto Measurements
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        SJ
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        Sarah Johnson
                      </p>
                      <p className="text-xs text-gray-500">With order #1234</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">
                        MC
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        Mike Chen
                      </p>
                      <p className="text-xs text-gray-500">
                        Shared measurement
                      </p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Tab */}
        {activeTab === "manual" && (
          <div className="px-4 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">Measurements</h4>
              <div className="space-y-3">
                {measurements?.map((measurement) => (
                  <div
                    onClick={() => {
                      setSelectedMeasurement(measurement);
                      setShowDetail(true);
                    }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {measurement?.customer?.name
                            ? measurement.customer.name.charAt(0) +
                              measurement.customer.name.charAt(1)
                            : ""}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {measurement?.customer?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {measurement?.method}
                        </p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-4">
                <img
                  src="https://readdy.ai/api/search-image?query=icon%2C%20measuring%20tape%20with%20notepad%2C%203D%20cartoon%20style%2C%20vibrant%20colors%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20clean%20modern%20look&width=100&height=100&seq=manual1&orientation=squarish"
                  alt="Manual Entry"
                  className="w-20 h-20 mx-auto object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium text-gray-800">
                  Quick Manual Entry
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add measurements on the go
                </p>
              </div>

              <Link href="/measurements/new">
                <button className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium">
                  + Manual Measurement
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {showDetail && selectedMeasurement && (
        <MeasurementDetail
          measurement={selectedMeasurement}
          setShowDetail={setShowDetail}
        />
      )}
    </div>
  );
}
