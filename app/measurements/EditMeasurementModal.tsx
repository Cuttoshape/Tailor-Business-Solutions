"use client";
import { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/api";
import {
  femaleMeasurements as FEMALE_FIELDS,
  maleMeasurements as MALE_FIELDS,
} from "./new/page";

type EditableMeasurement = {
  id: string;
  measurements: Record<string, string | number>;
};

export default function EditMeasurementModal({
  open,
  measurement,
  gender,
  onClose,
  onSaved,
}: {
  open: boolean;
  measurement: EditableMeasurement;
  gender?: string;
  onClose: () => void;
  onSaved: (updated: EditableMeasurement) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    Object.entries(measurement.measurements ?? {}).forEach(([k, v]) => {
      initial[k] = String(v ?? "");
    });
    setValues(initial);
  }, [measurement]);

  const fields = useMemo(
    () => ((gender ?? "male").toLowerCase() === "female" ? FEMALE_FIELDS : MALE_FIELDS),
    [gender]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900">Edit Measurement</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <i className="ri-close-line text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Measurements {((gender ?? "").toLowerCase() === "female" ? "(Female)" : "(Male)")}
            </label>
            <div className="space-y-3">
              {fields.map((m) => (
                <div key={m.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {m.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-3 pr-16 border border-gray-300 rounded-lg text-sm"
                      placeholder="0.0"
                      value={values[m.key] ?? ""}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [m.key]: e.target.value }))
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
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-end gap-3 flex-shrink-0">
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
            disabled={saving}
            onClick={async () => {
              try {
                setSaving(true);
                const res = (await apiClient.measurements.update(measurement.id, {
                  measurements: values,
                })) as any;
                onSaved(res?.measurement ?? { ...measurement, measurements: values });
                onClose();
              } catch (err) {
                console.error("Failed to save measurement", err);
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


