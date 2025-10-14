"use client";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api";

type EditableCustomer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export default function EditCustomerModal({
  open,
  customer,
  onClose,
  onSaved,
}: {
  open: boolean;
  customer: EditableCustomer;
  onClose: () => void;
  onSaved: (updated: EditableCustomer) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EditableCustomer>(customer);

  useEffect(() => {
    setForm(customer);
  }, [customer]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Edit Customer</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <i className="ri-close-line text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone ?? ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              rows={3}
              value={form.address ?? ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || !form.name.trim()}
            onClick={async () => {
              try {
                setSaving(true);
                const res = (await apiClient.customers.update(form.id, {
                  name: form.name,
                  email: form.email,
                  phone: form.phone,
                  address: form.address,
                })) as any;
                onSaved(res?.customer ?? form);
                onClose();
              } catch (err) {
                console.error("Failed to save customer", err);
              } finally {
                setSaving(false);
              }
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}


