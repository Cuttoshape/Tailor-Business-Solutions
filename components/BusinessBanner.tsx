"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import CreateBannerModal from "./CreateBannerModal";
import BannerCard from "./BannerCard";
import BusinessEditModal from "./BusinessEditModal";

export type BannerData = {
  id?: number | string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
};

type GetBannerResponse = {
  banner: BannerData | null;
};

export default function BusinessBanner({ businessId }: { businessId: string }) {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [open, setOpen] = useState(false);
  const [openBizEdit, setOpenBizEdit] = useState(false);

  const fetchBusinessBanner = async () => {
    try {
      const data = (await apiClient.banners.get(
        businessId
      )) as unknown as GetBannerResponse;
      setBanner(data?.banner ?? null);
    } catch (err) {
      console.error("Failed to fetch banner:", err);
      setBanner(null);
    }
  };

  useEffect(() => {
    if (businessId) void fetchBusinessBanner();
  }, [businessId]);

  return (
    <section className="w-full">
      {banner && banner.title ? (
        <BannerCard
          banner={{
            ...banner,
            ctaLabel: "Contact Us",
            onCtaClick: () => console.log("/bookings"),
            onEdit: () => setOpen(true),
          }}
        />
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
          businessId={businessId}
          onClose={() => setOpen(false)}
          onCreated={(created: BannerData) => {
            setBanner(created);
            setOpen(false);
            void fetchBusinessBanner();
          }}
          initialBanner={banner ?? undefined}
          onUpdated={(updated: BannerData) => {
            setBanner(updated);
            setOpen(false);
            void fetchBusinessBanner();
          }}
        />
      )}
    </section>
  );
}
