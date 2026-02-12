"use client";

import { useMemo, useState, useEffect } from "react";

// Date de début de votre histoire.
const START_DATE = new Date("2025-11-24T00:00:00");

function differenceInDays(a: Date, b: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = a.getTime() - b.getTime();
  return Math.floor(diff / msPerDay);
}

export const COUNT_UP_DURATION_MS = 5000; // de 0 à la valeur en 5 secondes (temps de lire)

// Compteur : nombre de jours qu'on se connaît (depuis le 24 novembre 2025).
// Le chiffre monte de 0 à la valeur réelle. onComplete appelé à la fin (optionnel).
export function LoveCounter({ onComplete }: { onComplete?: () => void }) {
  const daysSinceStart = useMemo(
    () => Math.max(differenceInDays(new Date(), START_DATE), 0),
    []
  );

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let doneCalled = false;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / COUNT_UP_DURATION_MS);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.floor(eased * daysSinceStart));
      if (progress >= 1 && !doneCalled) {
        doneCalled = true;
        onComplete?.();
      }
      if (progress < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [daysSinceStart, onComplete]);

  return (
    <section className="rounded-2xl bg-white/90 px-4 py-4 shadow-md shadow-red-100">
      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#b30000]/80 mb-3 text-center">
        Compteur de notre histoire
      </h3>

      <div className="flex flex-col items-center justify-center">
        <p className="text-4xl font-semibold text-[#b30000] tabular-nums">
          {display}
        </p>
        <p className="text-sm text-[#661111]/80 mt-1">
          jours qu&apos;on se connaît
        </p>
      </div>

      <p className="mt-3 text-[11px] text-[#661111]/70 text-center">
        Chaque jour en plus est une mise à jour de plus de mon système émotionnel.
      </p>
    </section>
  );
}

