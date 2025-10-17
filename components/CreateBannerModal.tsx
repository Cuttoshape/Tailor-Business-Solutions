"use client";

/* --------------------------------------------------------------------------------
 * CreateBanner Modal
 * -------------------------------------------------------------------------------*/
import { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/api";
import type { BannerData } from "./BusinessBanner";

type CreateBannerModalProps = {
  businessId: string; // required for create
  onClose: () => void;
  onCreated: (banner: BannerData) => void;
  // Edit support
  initialBanner?: BannerData | null; // when provided, modal acts as edit
  onUpdated?: (banner: BannerData) => void;
};

type CreateBannerResponse =
  | { banner: BannerData } // if your API wraps the object
  | BannerData; // or returns the object directly

export default function CreateBannerModal({
  businessId,
  onClose,
  onCreated,
  initialBanner,
  onUpdated,
}: CreateBannerModalProps) {
  const [title, setTitle] = useState(initialBanner?.title ?? "");
  const [description, setDescription] = useState(initialBanner?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // URL-based image update for edit mode
  const [imageUrlInput, setImageUrlInput] = useState<string>(initialBanner?.imageUrl ?? "");

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isEdit = !!initialBanner?.id;
  const sanitizedExistingUrl = initialBanner?.imageUrl
    ? initialBanner.imageUrl.replace(/\s/g, "%20")
    : null;

  const canSubmit = useMemo(() => {
    const hasTitle = title.trim().length > 0;
    if (isEdit) return hasTitle && !submitting; // image optional when editing
    return hasTitle && !!file && !submitting; // require image on create
  }, [title, file, submitting, isEdit]);

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
    // In edit mode, revert to existing banner image; otherwise clear
    setPreviewUrl(isEdit ? (imageUrlInput?.trim() || sanitizedExistingUrl) : null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
      try {
        if (isEdit && initialBanner?.id) {
          // Frontend-only edit: use imageUrl field (no file uploads)
          if (file) {
            setError(
              "Replacing the banner image with a new file isn't supported without backend changes. Use the Image URL field instead."
            );
            return;
          }

          const payload: Record<string, any> = {
            title: title.trim(),
            description: description.trim(),
          };
          const trimmedUrl = imageUrlInput.trim();
          if (trimmedUrl) payload.imageUrl = trimmedUrl;

          const updated = (await apiClient.banners.updateById(
            initialBanner.id,
            payload
          )) as CreateBannerResponse;

          const normalized: BannerData =
            "banner" in updated ? updated.banner : updated;
          const result: BannerData = {
            id: normalized?.id ?? (initialBanner.id as any),
            title: normalized?.title ?? title.trim(),
            description: normalized?.description ?? description.trim(),
            imageUrl:
              normalized?.imageUrl ?? (trimmedUrl ? trimmedUrl : initialBanner.imageUrl),
          };
          onUpdated?.(result);
      } else {
        // Create path: require file
        // Primary source of truth: prop
        let bizId = businessId;
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
        if (file) form.append("image", file);

        const created = (await apiClient.banners.create(
          form
        )) as CreateBannerResponse;

        const normalized: BannerData =
          "banner" in created ? created.banner : created;
        const result: BannerData = {
          id: normalized?.id,
          title: normalized?.title ?? title.trim(),
          description: normalized?.description ?? description.trim(),
          imageUrl: normalized?.imageUrl,
        };
        onCreated(result);
      }
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
          <h3 className="text-lg font-semibold">{isEdit ? "Edit Banner" : "Create Banner"}</h3>
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

            {/* Always keep an input available for changing image */}
            <input
              ref={fileInputRef}
              id="banner-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {(() => {
              const effectivePreview =
                previewUrl || (isEdit ? (imageUrlInput?.trim() || sanitizedExistingUrl) : null);
              if (effectivePreview) {
                return (
                  <div className="relative rounded-lg overflow-hidden border">
                    <div
                      className="w-full h-40 sm:h-48 bg-gray-100"
                      style={{
                        backgroundImage: `url(${effectivePreview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      aria-label="Banner image"
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                    />
                    {!isEdit && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2 py-1 rounded bg-white/90 text-gray-700 text-xs shadow hover:bg-white"
                          title="Change image"
                        >
                          Change
                        </button>
                        {(!!previewUrl || !isEdit) && (
                          <button
                            onClick={clearFile}
                            className="px-2 py-1 rounded bg-white/90 text-gray-700 text-xs shadow hover:bg-white"
                            type="button"
                            title="Remove selected image"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {!isEdit ? (
                    <>
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
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">Provide an Image URL below to update the banner image.</p>
                  )}
                </div>
              );
            })()}
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (edit mode)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.currentTarget.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste a direct image URL. File uploads during edit are not supported without backend changes.
              </p>
            </div>
          )}

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
            {submitting ? "Saving..." : isEdit ? "Update Banner" : "Save Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}
