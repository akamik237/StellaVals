"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { LoveCounter } from "@/components/LoveCounter";

// Page 3 – Programme Saint-Valentin
// Le compteur remplit d'abord l'écran, puis disparaît et le reste du contenu apparaît.

const PAUSE_AFTER_COUNTER_MS = 4000; // temps pour lire le chiffre et le texte avant transition

export default function ProgrammePage() {
  const [showRest, setShowRest] = useState(false);

  const handleCounterComplete = useCallback(() => {
    setTimeout(() => setShowRest(true), PAUSE_AFTER_COUNTER_MS);
  }, []);

  return (
    <div className="min-h-[70vh] relative">
      {/* Phase 1 : le compteur remplit le contenu */}
      {!showRest && (
        <div className="min-h-[70vh] flex items-center justify-center transition-opacity duration-500">
          <div className="w-full max-w-sm">
            <LoveCounter onComplete={handleCounterComplete} />
          </div>
        </div>
      )}

      {/* Phase 2 : après la fin du compteur, il disparaît et le reste apparaît */}
      {showRest && (
        <div className="space-y-6 text-left animate-fade-up">
          <h1 className="romantic-title text-center text-2xl">
            Programme Saint-Valentin
          </h1>

          <div className="romantic-card p-4 rounded-2xl">
            <h2 className="text-base font-semibold text-[#b30000] mb-2">
              Petit bug logistique détecté 😅
            </h2>
            <p className="text-sm text-[#661111]/90">
              Le lieu prévu était complet pour le 14.<br />
              Pas de panique, j&apos;ai un plan de secours.
            </p>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-[#b30000] mb-2">
              14 février
            </h2>
            <ul className="text-sm text-[#661111]/90 space-y-1">
              <li>Séance de pose de cils à 12h</li>
              <li>Petite ballade en ville</li>
              <li>De grâce, être prête en moins de temps possible</li>
            </ul>
          </section>

          <p className="text-sm text-[#661111]/90">
            La vraie sortie officielle est programmée le <strong>21 février à 14h pile</strong>.
            Tout retard supérieur à 10 minutes sera facturé en câlins et bisous.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-[#b30000] mb-2">
              21 février — sortie officielle
            </h2>
            <ul className="text-sm text-[#661111]/90 space-y-2 list-disc list-inside">
              <li>Arrivée sur les lieux (garde secret pour l&apos;instant)</li>
              <li>Yeux couverts anti-spoiler</li>
              <li>Porté jusqu&apos;au lieu prévu</li>
              <li>Menottage</li>
              <li>La suite -18…</li>
            </ul>
          </section>

          <Link href="/message" className="romantic-button block text-center mt-6">
            Suite →
          </Link>
        </div>
      )}
    </div>
  );
}
