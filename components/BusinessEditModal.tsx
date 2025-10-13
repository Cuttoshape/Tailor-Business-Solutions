"use client";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api";

type Business = {
  id: string;
  name: string;
  isActive?: boolean;
  description?: string | null;
  imageUrl?: string | null;
};

export default function BusinessEditModal({
  open,
  businessId,
  onClose,
  onSaved,
}: {
  open: boolean;
  businessId: string;
  onClose: () => void;
  onSaved: (updated: Business) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Pick<Business, "name" | "isActive" | "description" | "imageUrl">>({
    name: "",
    isActive: true,
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    const run = async () => {
      if (!open || !businessId) return;
      setLoading(true);
      try {
        const data = (await apiClient.business.getOne(businessId)) as unknown as {
          business: Business;
        };
        const b = data?.business;
        if (b) {
          setForm({
            name: b.name ?? "",
            isActive: b.isActive ?? true,
            description: b.description ?? "",
            imageUrl: b.imageUrl ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load business", err);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [open, businessId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Edit Business</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <i className="ri-close-line text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="biz-active"
                  type="checkbox"
                  checked={!!form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="h-4 w-4"
                />
                <label htmlFor="biz-active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
            </>
          )}
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
              if (!businessId) return;
              try {
                setSaving(true);
                const res = (await apiClient.business.update(businessId, {
                  name: form.name,
                  description: form.description,
                  isActive: form.isActive,
                  imageUrl: form.imageUrl,
                })) as unknown as { business: Business };
                if (res?.business) onSaved(res.business);
                onClose();
              } catch (err) {
                console.error("Failed to save business", err);
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


