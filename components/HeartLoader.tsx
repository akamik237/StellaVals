"use client";

import { useMemo, useEffect, useRef } from "react";

const HEARTBEAT_MS = 900;

interface HeartLoaderProps {
  /**
   * Texte affiché sous le cœur (facile à personnaliser).
   */
  label?: string;
  /**
   * Son + vibration comme le cœur de la page d'accueil.
   */
  withSound?: boolean;
}

// Cœur animé : même battement que la page d'accueil (heartbeat 0.9s).
export function HeartLoader({ label, withSound = false }: HeartLoaderProps) {
  const ariaLabel = useMemo(
    () => label ?? "Cœur animé qui bat pour toi",
    [label]
  );
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!withSound || typeof window === "undefined") return;
    const audio = new Audio("/heartbeat.mp3");
    heartbeatAudioRef.current = audio;
    audio.volume = 1.0;
    const playBeat = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      if (window.navigator.vibrate) window.navigator.vibrate([80, 120, 80, 620]);
    };
    playBeat();
    heartbeatIntervalRef.current = setInterval(playBeat, HEARTBEAT_MS);
    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
      audio.pause();
      heartbeatAudioRef.current = null;
    };
  }, [withSound]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        aria-label={ariaLabel}
        role="img"
        className="heart-loader-beating flex h-32 w-32 items-center justify-center rounded-full bg-white/80 shadow-lg shadow-red-200"
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

