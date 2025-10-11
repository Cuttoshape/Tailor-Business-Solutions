"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import CustomerBioAddForm from "@/components/CustomerBioAddForm";

type FormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "new" | "active" | "vip";
  notes: string;
  gender: string;
};

const STEP_LABELS = ["Basic Info", "Address", "Preview"];

export default function AddCustomerPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "new",
    notes: "",
    gender: "",
  });

  console.log("------formData-------", formData);

  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Validation (simple, lightweight) ---
  const stepErrors = useMemo(() => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) errs.name = "Full name is required.";
      if (!formData.email.trim()) errs.email = "Email is required.";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email))
        errs.email = "Enter a valid email.";
      if (!formData.phone.trim()) errs.phone = "Phone number is required.";
    }
    if (currentStep === 2) {
      if (!formData.address.trim()) errs.address = "Address is required.";
    }
    // Step 3 is preview-only; no new fields
    return errs;
  }, [currentStep, formData]);

  const isStepValid = Object.keys(stepErrors).length === 0;

  const nextStep = () => {
    if (currentStep < 3 && isStepValid) {
      setStep((s) => s + 1);
      setCurrentStep((s) => s + 1);
    }
  };
  const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

  const handleSubmit = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      // Submit only entered details; Step 3 is just preview.
      await apiClient.customers.create(formData);
      setShowSuccess(true);
      // Redirect after a short pause
      setTimeout(() => {
        router.push("/customers");
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to add customer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-10">
        <div className="px-4 py-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/customers"
                className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100"
              >
                <i className="ri-arrow-left-line text-xl text-gray-700"></i>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Add Customer
              </h1>
            </div>
            <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
          </div>

          {/* Progress Bar */}

          <div className="px-4 py-4 bg-gray-50">
            {errorMsg && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <div className="flex items-start space-x-2">
                  <i className="ri-error-warning-line mt-0.5"></i>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}
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
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Basic Info</span>
              <span>Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-32 px-4 max-w-3xl mx-auto">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4 pt-6">
            <CustomerBioAddForm formData={formData} setFormData={setFormData} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    value: "new",
                    label: "New",
                    color: "bg-blue-100 text-blue-700",
                    dot: "bg-blue-500",
                  },
                  {
                    value: "active",
                    label: "Active",
                    color: "bg-green-100 text-green-700",
                    dot: "bg-green-500",
                  },
                  {
                    value: "vip",
                    label: "VIP",
                    color: "bg-purple-100 text-purple-700",
                    dot: "bg-purple-500",
                  },
                ].map((status) => {
                  const active =
                    formData.status === (status.value as FormData["status"]);
                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => handleInputChange("status", status.value)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                        active
                          ? `${status.color} ring-2 ring-offset-2 ring-teal-500`
                          : "bg-gray-100 text-gray-600"
                      }`}
                      aria-pressed={active}
                    >
                      <span>{status.label}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          active ? status.dot : "bg-gray-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
                placeholder="Any extra details about this customer…"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 pt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <PreviewCard label="Full Name" value={formData.name} />
              <PreviewCard label="Email" value={formData.email} />
              <PreviewCard label="Phone" value={formData.phone} />
              <PreviewCard
                label="Status"
                value={
                  formData.status === "new"
                    ? "New"
                    : formData.status === "active"
                    ? "Active"
                    : "VIP"
                }
                badge
              />
              <PreviewCard
                className="sm:col-span-2"
                label="Address"
                value={formData.address}
                multiline
              />
              {formData.notes?.trim() && (
                <PreviewCard
                  className="sm:col-span-2"
                  label="Notes"
                  value={formData.notes}
                  multiline
                />
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pb-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-300"
            >
              <i className="ri-arrow-left-line"></i>
              <span>Previous</span>
            </button>
          )}

          {currentStep < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid}
              className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition ${
                isStepValid
                  ? "bg-teal-500 text-white hover:bg-teal-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span>Next</span>
              <i className="ri-arrow-right-line"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center space-x-2 ${
                submitting
                  ? "bg-teal-400 cursor-wait text-white"
                  : "bg-teal-500 text-white hover:bg-teal-600"
              }`}
            >
              {submitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>Adding…</span>
                </>
              ) : (
                <>
                  <i className="ri-user-add-line"></i>
                  <span>Add Customer</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Customer Added!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {formData.name} has been successfully added to your customer list.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <i className="ri-loader-4-line animate-spin"></i>
              <span>Redirecting…</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** ---------- UI helpers ---------- */

function SectionHeader({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-2">
      <div
        className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}
      >
        <i className={`${icon} text-2xl ${iconColor}`}></i>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {input}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
          <i className="ri-error-warning-line"></i>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function PreviewCard({
  label,
  value,
  badge,
  multiline,
  className = "",
}: {
  label: string;
  value: string;
  badge?: boolean;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm ${className}`}
    >
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {badge ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {value}
        </span>
      ) : (
        <div className={`text-sm text-gray-800 ${multiline ? "" : "truncate"}`}>
          {value || "—"}
        </div>
      )}
    </div>
  );
}
