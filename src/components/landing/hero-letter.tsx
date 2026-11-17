type Props = {
  sampleLine?: string;
};

/** Cream deckled stationery — tactile paper on night sky, Opekkha wax seal. */
export function HeroLetter({
  sampleLine = "যখন তোমার মনে পড়ে আমাকে…",
}: Props) {
  return (
    <div
      className="hero-letter relative mx-auto aspect-[3/3.7] w-full max-w-[19rem] sm:max-w-[22rem]"
      aria-hidden="true"
    >
      {/* Soft crimson underglow like Chithi’s letter bloom */}
      <div className="letter-glow absolute left-1/2 top-[42%] h-[70%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(224,91,98,0.35),transparent_68%)] blur-2xl" />

      <div className="absolute inset-[12%] translate-x-5 translate-y-4 rotate-[7deg] rounded-[0.2rem] bg-[#cfc3b4] opacity-50" />
      <div className="absolute inset-[8%] -translate-x-3.5 rotate-[-5deg] rounded-[0.25rem] bg-[#e8ddd0] opacity-90 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.7)]" />

      <div className="envelope letter-sheet letter-deckle absolute inset-[2%] overflow-hidden">
        {/* Parchment grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative flex h-full flex-col px-7 pb-8 pt-9 sm:px-8 sm:pt-10">
          <p className="font-brand-en text-[0.62rem] tracking-[0.32em] text-[var(--letter-muted)]">
            OPEN WHEN
          </p>

          <p className="font-brand-bn mt-5 text-[1.35rem] leading-[1.6] text-[var(--letter-ink)] sm:mt-6 sm:text-[1.55rem]">
            {sampleLine}
          </p>

          <div className="mt-6 space-y-3.5 opacity-[0.2]">
            <div className="h-px w-[94%] bg-[var(--letter-ink)]" />
            <div className="h-px w-[86%] bg-[var(--letter-ink)]" />
            <div className="h-px w-[90%] bg-[var(--letter-ink)]" />
            <div className="h-px w-[72%] bg-[var(--letter-ink)]" />
            <div className="h-px w-[80%] bg-[var(--letter-ink)]" />
            <div className="h-px w-[64%] bg-[var(--letter-ink)]" />
          </div>

          <div className="mt-auto flex items-end justify-between pt-8">
            <p className="max-w-[8.5rem] text-[0.68rem] leading-snug text-[var(--letter-muted)] italic">
              Sealed for the moment it matters.
            </p>

            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-[var(--seal)]/40 blur-xl" />
              <div className="seal-spin relative flex h-[4.1rem] w-[4.1rem] items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#e07a7e,#9a3d42_55%,#5a2428)] shadow-[0_12px_28px_-6px_rgba(90,36,40,0.95)] ring-1 ring-white/35">
                <span className="font-brand-bn text-xl text-[#fff6f0]">অ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
