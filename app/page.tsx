"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Page 1 – Intro : texte en écriture auto, cœur qui apparaît puis bat (son + vibration), clic pour ouvrir.

const INTRO_TEXT =
  "Si tu lis ces mots, c'est que tu occupes déjà une place rare dans mes pensées.\n\n" +
  "Certaines personnes croisent nos chemins,\nd'autres transforment doucement mes journées.\n" +
  "Toi, tu m'apportes une clarté calme —\ndiscrète, naturelle, et qui me touche.\n\n" +
  "Ta présence m'apaise. Ton énergie me réchauffe.\nTon sourire fait tomber mes défenses sans que je m'y attende.\n\n" +
  "Quand je pense à toi, ce ne sont pas de grands discours —\nce sont des sensations vraies : la douceur, la chaleur, l'envie de prolonger l'instant.\n\n" +
  "Cette expérience est simple.\nMais elle est sincère.\n\n" +
  "Écoute mon cœur qui bat…\nil sait déjà pourquoi.";
const TYPE_DELAY_MS = 95;
const HEART_APPEAR_DELAY_MS = 800;
const HEARTBEAT_MS = 900;

const MUSIC_CARD_SHOW_MS = 1800;
const MUSIC_CARD_VISIBLE_MS = 20000; // card stays visible for 10 secs

function playTypingTick(audioContextRef: React.MutableRefObject<AudioContext | null>) {
  if (typeof window === "undefined") return;
  try {
    const ctx = audioContextRef.current ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (!audioContextRef.current) audioContextRef.current = ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.025);
  } catch {
    // ignore if audio not allowed
  }
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [heartBeating, setHeartBeating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showMusicCard, setShowMusicCard] = useState(false);
  const [hideMusicCard, setHideMusicCard] = useState(false);
  const router = useRouter();
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatAudioRef = useRef<HTMLAudioElement | null>(null);
  const typingAudioContextRef = useRef<AudioContext | null>(null);

  const isTypingComplete = typedLength >= INTRO_TEXT.length;

  useEffect(() => {
    if (!hasStarted) return;
    const tShow = setTimeout(() => setShowMusicCard(true), MUSIC_CARD_SHOW_MS);
    return () => clearTimeout(tShow);
  }, [hasStarted]);

  useEffect(() => {
    if (!showMusicCard) return;
    const tHide = setTimeout(() => setHideMusicCard(true), MUSIC_CARD_VISIBLE_MS);
    return () => clearTimeout(tHide);
  }, [showMusicCard]);

  useEffect(() => {
    if (!hideMusicCard) return;
    const tRemove = setTimeout(() => setShowMusicCard(false), 600);
    return () => clearTimeout(tRemove);
  }, [hideMusicCard]);

  useEffect(() => {
    if (typedLength > 0 && typedLength < INTRO_TEXT.length && typedLength % 3 === 0) {
      playTypingTick(typingAudioContextRef);
    }
  }, [typedLength]);

  useEffect(() => {
    if (!hasStarted || typedLength >= INTRO_TEXT.length) return;
    const t = setTimeout(() => setTypedLength((n) => n + 1), TYPE_DELAY_MS);
    return () => clearTimeout(t);
  }, [hasStarted, typedLength]);

  useEffect(() => {
    if (!isTypingComplete) return;
    const t = setTimeout(() => setShowHeart(true), HEART_APPEAR_DELAY_MS);
    return () => clearTimeout(t);
  }, [isTypingComplete]);

  useEffect(() => {
    if (!showHeart) return;
    const t = setTimeout(() => setHeartBeating(true), 650);
    return () => clearTimeout(t);
  }, [showHeart]);

  useEffect(() => {
    if (!heartBeating || isOpen || typeof window === "undefined") return;
    const audio = new Audio("/heartbeat.mp3");
    heartbeatAudioRef.current = audio;
    audio.volume = 1.0;

    const playBeat = () => {
      audio.currentTime = 0;
      audio.play().catch(() => { });
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
  }, [heartBeating, isOpen]);

  const handleStart = () => {
    setHasStarted(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("startBackgroundMusic"));
      if ("vibrate" in window.navigator) window.navigator.vibrate(40);
    }
  };

  const handleHeartClick = () => {
    if (typeof window !== "undefined") {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      if (heartbeatAudioRef.current) {
        heartbeatAudioRef.current.pause();
        heartbeatAudioRef.current = null;
      }
      if ("vibrate" in window.navigator) window.navigator.vibrate(40);
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => router.push("/valentine"), 700);
    return () => clearTimeout(t);
  }, [isOpen, router]);

  const displayedIntro = INTRO_TEXT.slice(0, typedLength);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center overflow-visible px-1 relative">
      {!hasStarted ? (
        <div className="w-full flex flex-col items-center justify-center px-1 py-2">
          <div
            className="start-page-card w-full max-w-md aspect-[9/16] rounded-3xl overflow-hidden flex flex-col items-center justify-center relative shadow-xl"
            style={{
              backgroundImage: "url('/roses.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="start-page-card__overlay" aria-hidden />
            <div className="start-page-card__content relative z-10 flex flex-col items-center gap-6 px-6">
              <button
                type="button"
                onClick={handleStart}
                className="px-8 py-4 rounded-full text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                style={{
                  background: "linear-gradient(135deg, #ff4081 0%, #e91e63 50%, #b30000 100%)",
                  boxShadow: "0 10px 40px rgba(180,0,0,0.4)",
                }}
              >
                Commencer
              </button>
              <p className="text-[#4a2020]/95 text-sm sm:text-base max-w-xs font-medium drop-shadow-sm">
                J'espère que ça te plaira... 
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {showMusicCard && (
            <div
              className={`music-now-playing-card ${hideMusicCard ? "music-now-playing-card--out" : ""}`}
              aria-live="polite"
            >
              Ckay, Love Nwantiti playing
            </div>
          )}
          <div className="romantic-subtitle mb-4 max-w-lg text-left min-h-[12rem]">
            {displayedIntro.split("\n").map((line, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>
                {line || "\u00A0"}
              </p>
            ))}
            {!isTypingComplete && <span className="animate-pulse">|</span>}
          </div>
          {showHeart && (
            <>
              <p className="text-sm text-[#661111]/90 mb-2">Touche le cœur pour découvrir la suite</p>
              <span className="text-2xl text-[#b30000] mb-4 animate-float" aria-hidden="true">↓</span>
            </>
          )}

          <div
            className={`relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center overflow-visible transition-opacity duration-300 ${showHeart ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <button
              type="button"
              onClick={handleHeartClick}
              className={`heart-ico block w-full h-full rounded-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 overflow-visible ${showHeart ? "heart-ico--visible" : ""
                } ${heartBeating && !isOpen ? "heart-ico--beating" : ""} ${isOpen ? "open pointer-events-none" : ""}`}
              style={{
                background: "linear-gradient(135deg, #ff4081 0%, #e91e63 50%, #b30000 100%)",
                boxShadow: "0 10px 40px rgba(180,0,0,0.4)",
                transformOrigin: "center center",
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center text-[100px] sm:text-[120px] text-white drop-shadow-[2px_4px_8px_rgba(0,0,0,0.3)]"
                aria-hidden="true"
              >
                ♥
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
