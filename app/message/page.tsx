"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

// Enveloppe : couper le sticker, ouvrir, l'enveloppe disparaît tout de suite après ouverture, vidéo 3 fois puis /fin.

function getTouchDistance(
  touches: { length: number; 0?: Touch; 1?: Touch }
): number {
  if (touches.length < 2 || touches[0] == null || touches[1] == null) return 0;
  const a = touches[0];
  const b = touches[1];
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
}

const LOOPS_BEFORE_FIN = 3;
const ENVELOPE_HIDE_DELAY_MS = 600; // disparaît juste après l'ouverture (le temps de l'animation)

export default function MessagePage() {
  const router = useRouter();
  const [stickerCut, setStickerCut] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeGone, setEnvelopeGone] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const pinchRef = useRef<{ initialDistance: number; didCut: boolean } | null>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  const handleCutSticker = useCallback(() => {
    if (stickerCut) return;
    setStickerCut(true);
    setTimeout(() => setEnvelopeOpen(true), 400);
  }, [stickerCut]);

  const handleOpenFlap = useCallback(() => {
    if (!stickerCut || envelopeOpen) return;
    setEnvelopeOpen(true);
  }, [stickerCut, envelopeOpen]);

  useEffect(() => {
    if (!envelopeOpen) return;
    const t = setTimeout(() => setEnvelopeGone(true), ENVELOPE_HIDE_DELAY_MS);
    return () => clearTimeout(t);
  }, [envelopeOpen]);

  const handleFullscreenVideoEnded = useCallback(() => {
    setLoopCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (loopCount >= LOOPS_BEFORE_FIN) {
      router.push("/fin");
      return;
    }
    if (loopCount > 0) {
      fullscreenVideoRef.current?.play();
    }
  }, [loopCount, router]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 2 || pinchRef.current) return;
      pinchRef.current = {
        initialDistance: getTouchDistance(e.touches),
        didCut: false,
      };
    },
    []
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchRef.current = null;
  }, []);

  useEffect(() => {
    const el = envelopeRef.current;
    if (!el) return;
    const onMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinchRef.current) return;
      e.preventDefault();
      const dist = getTouchDistance(e.touches);
      const { initialDistance, didCut } = pinchRef.current;
      if (initialDistance < 20) return;
      const ratio = dist / initialDistance;
      if (ratio < 0.55 && !didCut) {
        pinchRef.current.didCut = true;
        setStickerCut(true);
        setEnvelopeOpen(true);
      }
    };
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => el.removeEventListener("touchmove", onMove);
  }, []);

  const showScissors = !stickerCut && !envelopeOpen;

  return (
    <div
      className={`envelope-page ${envelopeGone ? "envelope--gone" : ""}`}
      style={showScissors ? { cursor: "url('https://i.postimg.cc/GtLCdKxR/sisors.png') 16 16, pointer" } : undefined}
    >
      {envelopeGone && (
        <div className={`envelope-video-fullscreen envelope-video-fullscreen--visible`}>
          <video
            ref={fullscreenVideoRef}
            src="/dimetstella.mp4"
            autoPlay
            muted
            playsInline
            loop={false}
            onEnded={handleFullscreenVideoEnded}
            className="w-full h-full object-contain"
            aria-label="Vidéo pour Stella"
          />
        </div>
      )}
      <div
        ref={envelopeRef}
        className="envelope"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          pinchRef.current = null;
        }}
      >
        <div className="envelope__back-paper" />
        <div className="envelope__front-paper" />

        <div
          className={`envelope__up-paper ${envelopeOpen ? "envelope__up-paper--open" : ""} ${stickerCut ? "envelope__up-paper--clickable" : ""}`}
          onClick={stickerCut ? handleOpenFlap : undefined}
          role={stickerCut ? "button" : undefined}
          tabIndex={stickerCut ? 0 : undefined}
          onKeyDown={(e) => {
            if (stickerCut && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleOpenFlap();
            }
          }}
          aria-label={stickerCut ? "Ouvrir l'enveloppe" : undefined}
        />

        <div
          className={`envelope__sticker ${stickerCut ? "envelope__sticker--cut" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleCutSticker();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCutSticker();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Couper le sticker avec les ciseaux"
        />

        <div className="envelope__false-sticker" aria-hidden />

        <div className={`envelope__content ${envelopeOpen ? "envelope__content--visible" : ""}`}>
          <div className="envelope__letter">
            <video
              src="/dimetstella.mp4"
              autoPlay
              muted
              playsInline
              loop
              className="envelope__video"
              aria-label="Vidéo pour Stella"
            />
          </div>
        </div>
      </div>

      {!envelopeOpen && !envelopeGone && (
        <p className="envelope-hint">
          {!stickerCut
            ? "Utilise les ciseaux : clique sur le cœur pour couper. Sur mobile, pince avec deux doigts pour couper et ouvrir."
            : "Clique sur le rabat pour ouvrir l'enveloppe."}
        </p>
      )}
    </div>
  );
}
