/* BannerCard.tsx */
type Banner = {
  imageUrl?: string | null;
  title: string;
  description?: string | null;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export default function BannerCard({ banner }: { banner: Banner }) {
  const initial = (banner.title ?? "B").slice(0, 1).toUpperCase();

  return (
    <div className="relative rounded">
      <div
        className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-xl"
        style={{
          minHeight: 150,
          backgroundImage: banner.imageUrl
            ? `url(${banner.imageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: banner.imageUrl ? undefined : "#EEF2FF", // fallback
        }}
        role="img"
        aria-label={banner.title}
      >
        {/* Vignette + gradient wash for text legibility */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_100%,rgba(0,0,0,0.55),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
        {/* Subtle texture (only when no image) */}
        {!banner.imageUrl && (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.1)_100%)]" />
        )}

        {/* Content */}
        <div className="relative p-2 sm:p-8">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Monogram / emblem */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
              <span className="text-white text-2xl sm:text-3xl font-semibold tracking-wide">
                {initial}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-white text-xl sm:text-2xl font-semibold leading-snug drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                {banner.title}
              </h2>

              {banner.description ? (
                <p className="mt-1 text-white/85 text-sm sm:text-base leading-relaxed line-clamp-2">
                  {banner.description}
                </p>
              ) : null}

              {/* Actions */}
              {banner.ctaLabel && banner.onCtaClick && (
                <div className="mt-4">
                  <button
                    onClick={banner.onCtaClick}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium
                               bg-white/90 text-gray-900 hover:bg-white transition
                               ring-1 ring-black/5 shadow-sm active:scale-[0.98]"
                  >
                    {banner.ctaLabel}
                    <i className="ri-arrow-right-up-line text-base" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
