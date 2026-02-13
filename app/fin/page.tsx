"use client";

import Link from "next/link";
import { HeartLoader } from "@/components/HeartLoader";

// Page 5 – Fin de l'expérience + signature (la carte Saint-Valentin est sur /message).

export default function FinPage() {
  return (
    <div className="space-y-8 text-center">
      <HeartLoader label="" withSound />

      <div>
        <p className="text-xl font-semibold text-[#b30000] mb-6">
          Merci d&apos;être entrée dans ma vie.
        </p>
        <Link href="/" className="romantic-button inline-block max-w-xs mx-auto">
          Recommencer l&apos;expérience
        </Link>
      </div>

      <div className="romantic-card p-5 text-center">
        <h2 className="text-lg font-semibold text-[#b30000] mb-3">
          Mot de ton ingénieur ❤️‍🔥
        </h2>
        <p className="text-sm text-[#661111]/90 leading-relaxed mb-3">
          Pensé avec le cœur, assemblé avec soin, et déployé avec intention par ton ingénieur du cœur.
          Structure fiable, logique amoureuse, compatibilité parfaite avec ton sourire.
          Certaines fonctionnalités restent protégées…
          et ne s&apos;activent qu&apos;en proximité certifiée 😌🔥
        </p>
        <p className="text-xs text-[#661111]/70">
          Build : HeartEngine v1.3 — chiffré, stable, et irrésistiblement attiré par toi.
        </p>
      </div>
    </div>
  );
}
