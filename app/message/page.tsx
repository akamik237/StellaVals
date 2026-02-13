"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

// Enveloppe : sur mobile = glisser les ciseaux sur le ruban pour couper ; sur desktop = clic. Tutoriel ciseaux grisés au début.

const SCISSORS_IMG = "https://i.postimg.cc/GtLCdKxR/sisors.png";
const LOOPS_BEFORE_FIN = 3;
const ENVELOPE_HIDE_DELAY_MS = 600;
const CUT_HIT_RADIUS_PX = 50; // distance ciseaux ↔ centre ruban pour déclencher la coupe
const TUTORIAL_DURATION_MS = 3500; // durée tutoriel puis affichage ciseaux draggables

function getTouchDistance(
  touches: { length: number; 0?: Touch; 1?: Touch }
): number {
  if (touches.length < 2 || touches[0] == null || touches[1] == null) return 0;
  const a = touches[0];
  const b = touches[1];
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
}

export default function MessagePage() {
  const router = useRouter();
  const [stickerCut, setStickerCut] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeGone, setEnvelopeGone] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [scissorsPos, setScissorsPos] = useState({ x: 0, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const pinchRef = useRef<{ initialDistance: number; didCut: boolean } | null>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const scissorsSize = 48;

  useEffect(() => {
    const m = () =>
      setIsMobile(
        typeof window !== "undefined" &&
          (window.matchMedia("(pointer: coarse)").matches ||
            window.matchMedia("(max-width: 768px)").matches)
      );
    m();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", m);
      setScissorsPos({
        x: (window.innerWidth - scissorsSize) / 2,
        y: 24,
      });
    }
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("resize", m);
    };
  }, []);

  useEffect(() => {
    if (!isMobile || stickerCut) return;
    const t = setTimeout(() => setShowTutorial(false), TUTORIAL_DURATION_MS);
    return () => clearTimeout(t);
  }, [isMobile, stickerCut]);

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

  const loopsBeforeFin = isMobile ? 2 : LOOPS_BEFORE_FIN;

  useEffect(() => {
    if (loopCount >= loopsBeforeFin) {
      router.push("/fin");
      return;
    }
    if (loopCount > 0) {
      fullscreenVideoRef.current?.play();
    }
  }, [loopCount, loopsBeforeFin, router]);

  const checkCutByPosition = useCallback(
    (clientX: number, clientY: number) => {
      const sticker = stickerRef.current;
      if (!sticker || stickerCut) return;
      const r = sticker.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);
      if (dist <= CUT_HIT_RADIUS_PX) {
        handleCutSticker(); // coupe + ouvre après 400ms
      }
    },
    [stickerCut, handleCutSticker, handleOpenFlap]
  );

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (stickerCut || envelopeOpen) return;
      const w = typeof window !== "undefined" ? window.innerWidth : 400;
      const h = typeof window !== "undefined" ? window.innerHeight : 600;
      const x = Math.min(Math.max(0, clientX - scissorsSize / 2), w - scissorsSize);
      const y = Math.min(Math.max(0, clientY - scissorsSize / 2), h - scissorsSize);
      dragOffsetRef.current = { x: clientX - x, y: clientY - y };
      setScissorsPos({ x, y });
      setIsDragging(true);
    },
    [stickerCut, envelopeOpen]
  );

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const w = typeof window !== "undefined" ? window.innerWidth : 400;
      const h = typeof window !== "undefined" ? window.innerHeight : 600;
      const x = Math.min(Math.max(0, clientX - dragOffsetRef.current.x), w - scissorsSize);
      const y = Math.min(Math.max(0, clientY - dragOffsetRef.current.y), h - scissorsSize);
      setScissorsPos({ x, y });
    },
    [isDragging]
  );

  const endDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      setIsDragging(false);
      const w = typeof window !== "undefined" ? window.innerWidth : 400;
      const h = typeof window !== "undefined" ? window.innerHeight : 600;
      const x = Math.min(Math.max(0, clientX - dragOffsetRef.current.x), w - scissorsSize);
      const y = Math.min(Math.max(0, clientY - dragOffsetRef.current.y), h - scissorsSize);
      setScissorsPos({ x, y });
      checkCutByPosition(x + scissorsSize / 2, y + scissorsSize / 2);
    },
    [isDragging, checkCutByPosition]
  );

  const onScissorsTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      if (t) startDrag(t.clientX, t.clientY);
    },
    [startDrag]
  );
  const onScissorsTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      if (t) moveDrag(t.clientX, t.clientY);
    },
    [moveDrag]
  );
  const onScissorsTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const t = e.changedTouches[0];
      if (t) endDrag(t.clientX, t.clientY);
    },
    [endDrag]
  );

  const onScissorsPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startDrag(e.clientX, e.clientY);
    },
    [startDrag]
  );
  const onScissorsPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons !== 1) return;
      moveDrag(e.clientX, e.clientY);
    },
    [moveDrag]
  );
  const onScissorsPointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      endDrag(e.clientX, e.clientY);
    },
    [endDrag]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isMobile) return;
      if (e.touches.length !== 2 || pinchRef.current) return;
      pinchRef.current = {
        initialDistance: getTouchDistance(e.touches),
        didCut: false,
      };
    },
    [isMobile]
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchRef.current = null;
  }, []);

  useEffect(() => {
    if (isMobile) return;
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
  }, [isMobile]);

  const showScissorsCursor = !isMobile && !stickerCut && !envelopeOpen;
  const showDraggableScissors = isMobile && !stickerCut && !envelopeOpen && !showTutorial;

  return (
    <div
      className={`envelope-page ${envelopeGone ? "envelope--gone" : ""}`}
      style={showScissorsCursor ? { cursor: `url('${SCISSORS_IMG}') 16 16, pointer` } : undefined}
    >
      {/* Tutoriel mobile : ciseaux grisés qui glissent vers le ruban */}
      {isMobile && showTutorial && !stickerCut && (
        <div className="envelope-tutorial" aria-hidden>
          <div className="envelope-tutorial-scissors" />
          <p className="envelope-tutorial-text">Glisse les ciseaux vers le bas jusqu’au ruban</p>
        </div>
      )}

      {/* Ciseaux draggables (mobile) */}
      {showDraggableScissors && (
        <div
          className={`envelope-draggable-scissors ${isDragging ? "envelope-draggable-scissors--dragging" : ""}`}
          style={{
            left: scissorsPos.x,
            top: scissorsPos.y,
            width: scissorsSize,
            height: scissorsSize,
          }}
          onTouchStart={onScissorsTouchStart}
          onTouchMove={onScissorsTouchMove}
          onTouchEnd={onScissorsTouchEnd}
          onPointerDown={onScissorsPointerDown}
          onPointerMove={onScissorsPointerMove}
          onPointerUp={onScissorsPointerUp}
          role="img"
          aria-label="Glisse les ciseaux sur le ruban pour couper"
        >
          <img src={SCISSORS_IMG} alt="" width={scissorsSize} height={scissorsSize} draggable={false} />
        </div>
      )}

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
          ref={stickerRef}
          className={`envelope__sticker ${stickerCut ? "envelope__sticker--cut" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isMobile) handleCutSticker();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!isMobile) handleCutSticker();
            }
          }}
          role="button"
          tabIndex={isMobile ? -1 : 0}
          aria-label="Couper le sticker avec les ciseaux"
        >
          <div className="envelope__sticker-half envelope__sticker-half--left" aria-hidden />
          <div className="envelope__sticker-half envelope__sticker-half--right" aria-hidden />
        </div>

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
            ? isMobile
              ? "Glisse les ciseaux vers le bas jusqu'au ruban pour couper."
              : "Utilise les ciseaux : clique sur le cœur pour couper."
            : "Clique sur le rabat pour ouvrir l'enveloppe."}
        </p>
      )}
    </div>
  );
}
