"use client";

import { useMemo } from "react";

interface HeartLoaderProps {
  /**
   * Texte affiché sous le cœur (facile à personnaliser).
   */
  label?: string;
}

// Cœur animé réutilisable (page d'accueil, page de fin, etc.).
// L'animation de battement est définie dans `globals.css` (classe .animate-gentle-pulse).
export function HeartLoader({ label }: HeartLoaderProps) {
  const ariaLabel = useMemo(
    () => label ?? "Cœur animé qui bat pour toi",
    [label]
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        aria-label={ariaLabel}
        role="img"
        className="flex h-32 w-32 items-center justify-center rounded-full bg-white/80 shadow-lg shadow-red-200 animate-gentle-pulse"
      >
        <span className="text-5xl text-[#ff1a1a] drop-shadow-sm">♥</span>
      </div>
      {label && (
        <p className="text-xs text-center text-[#661111]/80 max-w-[13rem]">
          {label}
        </p>
      )}
    </div>
  );
}

