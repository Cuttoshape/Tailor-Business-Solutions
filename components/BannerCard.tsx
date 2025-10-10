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
    <div className="relative rounded-3xl">
      {/* Soft gradient ring */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/25 via-fuchsia-400/20 to-amber-400/25 blur-[18px] opacity-60 pointer-events-none" />

      <div
        className="relative w-full overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-xl"
        style={{
          minHeight: 200,
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
        <div className="relative p-6 sm:p-8">
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

          {/* Bottom badges row (optional aesthetic detail) */}
          {/* <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-wider bg-white/10 text-white/90 px-2.5 py-1 rounded-full ring-1 ring-white/20">
              Bespoke
            </span>
            <span className="text-[11px] uppercase tracking-wider bg-white/10 text-white/90 px-2.5 py-1 rounded-full ring-1 ring-white/20">
              Tailor-made
            </span>
            <span className="text-[11px] uppercase tracking-wider bg-white/10 text-white/90 px-2.5 py-1 rounded-full ring-1 ring-white/20">
              Since 1998
            </span>
          </div> */}
        </div>

        {/* Corner shine */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-2xl rounded-full" />
      </div>
    </div>
  );
}
