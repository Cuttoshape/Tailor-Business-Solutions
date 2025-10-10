"use client";

/* --------------------------------------------------------------------------------
 * CreateBanner Modal
 * -------------------------------------------------------------------------------*/
import { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/api";
import type { BannerData } from "./BusinessBanner";

type CreateBannerModalProps = {
  businessId: string; // ← required for type safety
  onClose: () => void;
  onCreated: (banner: BannerData) => void;
};

type CreateBannerResponse =
  | { banner: BannerData } // if your API wraps the object
  | BannerData; // or returns the object directly

export default function CreateBannerModal({
  businessId,
  onClose,
  onCreated,
}: CreateBannerModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && !!file && !submitting;
  }, [title, file, submitting]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Optional validation
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(f.type)) {
      setError("Please upload a JPEG, PNG, WEBP, or GIF image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setError("Image must be 8MB or smaller.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setError(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
  };

  const clearFile = () => {
    setFile(null);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!canSubmit || !file) return;
    setSubmitting(true);
    setError(null);
    try {
      // Primary source of truth: prop
      let bizId = businessId;

      // Optional fallback if you still want to support it
      if (!bizId) {
        const raw =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (raw) {
          const user = JSON.parse(raw) as { businessId?: string } | null;
          if (user?.businessId) bizId = user.businessId;
        }
      }

      if (!bizId) {
        throw new Error("Business ID is required to create a banner.");
      }

      const form = new FormData();
      form.append("title", title.trim());
      form.append("description", description.trim());
      form.append("businessId", bizId);
      form.append("image", file); // File is acceptable as Blob

      // apiClient.banners.create should accept FormData
      const created = (await apiClient.banners.create(
        form
      )) as CreateBannerResponse;

      // Normalize to BannerData regardless of API shape
      const normalized: BannerData =
        "banner" in created ? created.banner : created;

      const result: BannerData = {
        id: normalized?.id,
        title: normalized?.title ?? title.trim(),
        description: normalized?.description ?? description.trim(),
        imageUrl: normalized?.imageUrl, // support both keys
      };

      onCreated(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create banner.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create banner"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create Banner</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            aria-label="Close modal"
          >
            <i className="ri-close-line text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Image picker / preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>

            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden border">
                <div
                  className="w-full h-40 sm:h-48 bg-gray-100"
                  style={{
                    backgroundImage: `url(${previewUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label="Image preview"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={clearFile}
                    className="px-2 py-1 rounded bg-white/90 text-gray-700 text-xs shadow hover:bg-white"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  ref={fileInputRef}
                  id="banner-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="banner-image"
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  <i className="ri-image-add-line" />
                  Choose image
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended aspect ratio ~ 3:1
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              placeholder="e.g., Acme Tailoring"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              rows={3}
              placeholder="Short tagline for your business"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              canSubmit ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300"
            }`}
          >
            {submitting ? "Saving..." : "Save Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}
