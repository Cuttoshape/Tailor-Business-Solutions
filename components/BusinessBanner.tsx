"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/api";
import CreateBannerModal from "./CreateBannerModal";

export type BannerData = {
  id?: number | string;
  title: string;
  description?: string;
  imageUrl?: string;
};

type BusinessBannerProps = {
  bannerName?: string | null;
  bannerImageUrl?: string | null;
  bannerDescription?: string | null;
  backgroundColor?: string | null;
};

export default function BusinessBanner({
  bannerName,
  bannerImageUrl,
  bannerDescription,
  backgroundColor,
}: BusinessBannerProps) {
  const [banner, setBanner] = useState<BannerData | null>(() =>
    bannerName
      ? {
          title: bannerName,
          description: bannerDescription ?? undefined,
          imageUrl: bannerImageUrl ?? undefined,
          backgroundColor: backgroundColor,
        }
      : null
  );
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full">
      {banner?.title ? (
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-sm"
          style={{
            minHeight: 160,
            backgroundImage: banner.imageUrl
              ? `url(${banner.imageUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: banner.imageUrl ? undefined : "#eef2ff", // fallback color
          }}
          role="img"
          aria-label={banner.title}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
          <div className="relative p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
              {/* Accent logo-ish block; not an <img>, purely decorative */}
              <span className="text-white text-xl font-semibold">
                {banner.title?.charAt(0) ?? "B"}
              </span>
            </div>
            <div className="text-white">
              <p className="text-lg font-semibold leading-tight">
                {banner.title}
              </p>
              {banner.description ? (
                <p className="text-sm opacity-90 line-clamp-2">
                  {banner.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-dashed border-indigo-300 bg-indigo-50 p-6 text-center">
          <p className="text-indigo-700 mb-3">
            No business banner yet. Create one to personalize your storefront.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95"
          >
            <i className="ri-image-add-line" />
            Create Banner
          </button>
        </div>
      )}

      {open && (
        <CreateBannerModal
          onClose={() => setOpen(false)}
          onCreated={(data) => {
            setBanner(data);
            setOpen(false);
          }}
        />
      )}
    </section>
  );
}
