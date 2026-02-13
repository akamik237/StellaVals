"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Page 2 – Question Valentine pour Stella
// Modifier les textes directement ici si besoin.

const INTRO = `Depuis le 24 novembre 2025, un simple swipe est devenu une vraie histoire.
Je pensais dire salut — aujourd'hui je dis merci au destin (et un peu à l'algorithme 😄).`;

// Souvenirs + qualités en un seul paragraphe, avec un peu de vocabulaire tech
const SOUVENIRS_QUALITES = `Entre les trajets de 45 minutes et les raccompagnements après l'école, chaque moment avec toi est devenu une mise à jour majeure de mes journées. Nos appels nocturnes saturent mon cache et me volent le sommeil — mais ça en vaut la peine. Ton regard provoque, ta spontanéité me surprend, ton énergie m’attire, ton sourire me désarme. 1m69 de tentation sur pattes…`;

const EMOTION = "Tu as pris les droits administrateur sur mon système émotionnel.";

const CONFETTI_COLORS = ["#b30000", "#ff1a1a", "#ff4081", "#ff69b4", "#ffffff", "#ffd700", "#ffe6e6"];
const EXPLOSION_CONFETTI_COUNT = 2100;
const REDIRECT_AFTER_EXPLOSION_MS = 5200;

type ConfettiPiece = {
  id: number;
  originX: number;
  originY: number;
  delay: number;
  duration: number;
  dx: number;
  dy: number;
  drift: number;
  fall: number;
  rotation: number;
  color: string;
  size: number;
};

function generateExplosionConfetti(): ConfettiPiece[] {
  const w = typeof window !== "undefined" ? window.innerWidth : 400;
  const h = typeof window !== "undefined" ? window.innerHeight : 600;
  const cx = w / 2;
  const originY = h - 30;
  return Array.from({ length: EXPLOSION_CONFETTI_COUNT }, (_, i) => {
    const dx = (Math.random() - 0.5) * 160;
    const dy = -(650 + Math.random() * 500);
    return {
      id: i,
      originX: cx + (Math.random() - 0.5) * 60,
      originY,
      delay: Math.random() * 0.4,
      duration: 2.8 + Math.random() * 1.6,
      dx,
      dy,
      drift: (Math.random() - 0.5) * 380,
      fall: 200 + Math.random() * 350,
      rotation: (Math.random() - 0.5) * 1800,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 5 + Math.floor(Math.random() * 6),
    };
  });
}

export default function ValentinePage() {
  const router = useRouter();
  const ouiRef = useRef<HTMLAnchorElement>(null);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const moveNoAway = () => {
    setNoPosition({
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 80,
    });
    setShowTooltip(true);
  };

  const handleOuiClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setConfettiPieces(generateExplosionConfetti());
      if (typeof window !== "undefined" && "vibrate" in window.navigator) {
        window.navigator.vibrate([50, 30, 80]);
      }
      setTimeout(() => router.push("/programme"), REDIRECT_AFTER_EXPLOSION_MS);
    },
    [router]
  );

  return (
    <div className="space-y-6 text-center relative">
      {/* Confetti : du bas vers le haut, très haut */}
      {confettiPieces.length > 0 && (
        <div className="fixed inset-0 z-[60] pointer-events-none" aria-hidden="true">
          {confettiPieces.map((p) => (
            <div
              key={p.id}
              className="confetti-piece confetti-piece--cannon"
              style={
                {
                  left: `${p.originX - p.size / 2}px`,
                  top: `${p.originY - p.size / 2}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  "--delay": `${p.delay}s`,
                  "--duration": `${p.duration}s`,
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--drift": `${p.drift}px`,
                  "--fall": `${p.fall}px`,
                  "--rotation": `${p.rotation}deg`,
                  background: p.color,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      <h1 className="romantic-title text-3xl">
        Oyono Jeanne Stella 💖
      </h1>

      <p className="text-sm text-[#661111]/90 whitespace-pre-line text-left">
        {INTRO}
      </p>

      <p className="text-sm text-[#661111]/90 text-left leading-relaxed">
        {SOUVENIRS_QUALITES}
      </p>

      <p className="text-sm font-medium text-[#b30000] italic">{EMOTION}</p>

      <h2 className="text-2xl font-semibold text-[#b30000] mt-8">
        Veux-tu être ma Valentine ?
      </h2>

      <div className="flex flex-col gap-4 mt-6">
        <Link
          ref={ouiRef}
          href="/programme"
          className="romantic-button block"
          onClick={handleOuiClick}
        >
          OUI
        </Link>

        <p className="text-xs text-[#661111]/80 mt-1">
          Non n&apos;est pas une option… Essaie pour voir 😌
        </p>
        <div className="relative flex justify-center items-center min-h-[52px] mt-2">
          <button
            type="button"
            onClick={moveNoAway}
            onMouseEnter={moveNoAway}
            className="romantic-button-secondary absolute transition-transform duration-150"
            style={{
              transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
            }}
          >
            NON
          </button>
          {showTooltip && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-[#b30000] bg-white/95 px-2 py-1 rounded shadow whitespace-nowrap">
              T&apos;as vu ? Pas une option 😌
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
