/** Drifting letter-world ornaments — Chithi-like density, Opekkha crimson/warm palette. */
export function FloatingMotifs() {
  return (
    <div
      className="floating-motifs pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Soft bokeh blooms */}
      <span className="motif motif-a" />
      <span className="motif motif-b" />
      <span className="motif motif-c" />
      <span className="motif motif-d" />
      <span className="motif motif-e" />
      <span className="motif motif-f" />
      <span className="motif motif-g" />
      <span className="motif motif-h" />

      {/* Tiny sparkles */}
      <span className="sparkle sparkle-1" />
      <span className="sparkle sparkle-2" />
      <span className="sparkle sparkle-3" />
      <span className="sparkle sparkle-4" />
      <span className="sparkle sparkle-5" />
      <span className="sparkle sparkle-6" />

      {/* Envelope — left mid */}
      <svg className="motif-svg motif-envelope" viewBox="0 0 48 36" fill="none">
        <rect
          x="2"
          y="4"
          width="44"
          height="28"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M2 8 L24 22 L46 8" stroke="currentColor" strokeWidth="1.6" />
      </svg>

      {/* Envelope — right upper */}
      <svg className="motif-svg motif-envelope-2" viewBox="0 0 48 36" fill="none">
        <rect
          x="2"
          y="4"
          width="44"
          height="28"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M2 8 L24 22 L46 8" stroke="currentColor" strokeWidth="1.6" />
      </svg>

      {/* Blossom petals */}
      <svg className="motif-svg motif-petal" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 4c0 0-5.5 5-5.5 9.5a5.5 5.5 0 1 0 11 0C21.5 9 16 4 16 4Z" opacity="0.9" />
        <path d="M16 4c0 0 5.5 5 5.5 9.5a5.5 5.5 0 1 1-11 0C10.5 9 16 4 16 4Z" opacity="0.55" />
        <circle cx="16" cy="14" r="2.2" opacity="0.85" />
      </svg>
      <svg className="motif-svg motif-petal-2" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 3c0 0-6 5.5-6 10.5a6 6 0 1 0 12 0C22 8.5 16 3 16 3Z" />
        <circle cx="16" cy="14.5" r="2" opacity="0.7" />
      </svg>
      <svg className="motif-svg motif-petal-3" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 4c0 0-5 4.8-5 9a5 5 0 1 0 10 0C21 8.8 16 4 16 4Z" />
      </svg>
      <svg className="motif-svg motif-petal-4" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 5c0 0-4.5 4.2-4.5 8a4.5 4.5 0 1 0 9 0C20.5 9.2 16 5 16 5Z" />
      </svg>

      {/* Soft heart */}
      <svg className="motif-svg motif-heart" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-7.2-4.5-9.3-9.1C1.2 8.2 3.4 5 6.8 5c1.9 0 3.5 1.1 4.2 2.7C11.7 6.1 13.3 5 15.2 5c3.4 0 5.6 3.2 4.1 6.9C19.2 16.5 12 21 12 21Z" />
      </svg>

      {/* Butterfly silhouette */}
      <svg className="motif-svg motif-butterfly" viewBox="0 0 40 32" fill="currentColor">
        <path d="M20 16c-1.2-3.5-5.8-9-10.5-9C5 7 3 11 6.5 15.5 10 20 18 22 20 22c2 0 10-2 13.5-6.5C37 11 35 7 30.5 7 25.8 7 21.2 12.5 20 16Z" opacity="0.85" />
        <path d="M20 16c-1-2.8-4.2-7.2-8-7.2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.4" />
      </svg>
    </div>
  );
}
