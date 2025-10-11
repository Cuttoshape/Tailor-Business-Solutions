import React, { use, useEffect } from "react";
import { Customer } from "./CustomerLookup";

export default function CustomerBioAddForm({
  customer,
  formData,
  setFormData,
}: {
  customer?: Customer;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  useEffect(() => {
    if (customer) {
      setFormData({
        ...formData,
        name: customer?.name || "",
        age: customer?.age || "",
        gender: customer?.gender || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
      });
    }
  }, [customer]);

  return (
    <div>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-lg text-sm"
          placeholder="Enter customer name"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          value={formData.email}
          type="email"
          className="w-full p-3 border border-gray-200 rounded-lg text-sm"
          placeholder="Enter email address"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone #
        </label>
        <input
          value={formData.phone}
          type="email"
          className="w-full p-3 border border-gray-200 rounded-lg text-sm"
          placeholder="Enter email address"
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      {/* Gender + Age */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "female" })}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                formData.gender === "female"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Female
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "male" })}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                formData.gender === "male"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Male
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={formData.age ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                age: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
            className="w-full p-3 border border-gray-200 rounded-lg text-sm"
            placeholder="Age"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          value={formData.address ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full p-3 border border-gray-200 rounded-lg text-sm h-20"
          placeholder="Customer address"
          maxLength={500}
        />
      </div>
    </div>
  );
}
