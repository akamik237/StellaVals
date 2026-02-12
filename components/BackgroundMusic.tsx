"use client";

import { useEffect, useRef } from "react";

// Les navigateurs bloquent le son sans interaction. On précharge la piste et on démarre au premier clic/touch (ex. sur le cœur).

const MUSIC_URL = "/Nwantiti.mp3";

export default function BackgroundMusic() {
  const startedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      audio.play().catch(() => { startedRef.current = false; });
    };

    const removeListeners = () => {
      document.removeEventListener("click", start, true);
      document.removeEventListener("touchstart", start, true);
      document.removeEventListener("keydown", start, true);
      window.removeEventListener("startBackgroundMusic", start);
    };

    audio.load();
    audio.play().then(removeListeners).catch(() => { startedRef.current = false; });

    document.addEventListener("click", start, true);
    document.addEventListener("touchstart", start, true);
    document.addEventListener("keydown", start, true);
    window.addEventListener("startBackgroundMusic", start);

    return () => {
      removeListeners();
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  return null;
}
