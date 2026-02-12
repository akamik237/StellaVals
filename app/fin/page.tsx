"use client";

import Link from "next/link";
import { HeartLoader } from "@/components/HeartLoader";

// Page 5 – Fin de l'expérience + signature (la carte Saint-Valentin est sur /message).

export default function FinPage() {
  return (
    <div className="space-y-8 text-center">
      <HeartLoader label="" />

      <div>
        <p className="text-xl font-semibold text-[#b30000] mb-6">
          Merci d&apos;être entrée dans ma vie.
        </p>
        <Link href="/" className="romantic-button inline-block max-w-xs mx-auto">
          Recommencer l&apos;expérience
        </Link>
      </div>

      <div className="romantic-card p-5 text-left">
        <h2 className="text-lg font-semibold text-[#b30000] mb-3">
          Mot de ton ingénieur ❤️‍🔥
        </h2>
        <p className="text-sm text-[#661111]/90 leading-relaxed mb-3">
          Site conçu, compilé et déployé avec précision par ton ingénieur du cœur.
          Architecture stable, performance émotionnelle élevée,
          compatibilité totale avec ton sourire.
          Certaines fonctionnalités sont confidentielles…
          et se débloqueront en tête-à-tête 😌🔥
        </p>
        <p className="text-xs text-[#661111]/70">
          Build : HeartEngine v1.3 — sécurisé, chiffré, dangereusement attiré par toi.
        </p>
      </div>
    </div>
  );
}
