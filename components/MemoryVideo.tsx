// Composant vidéo dédié aux souvenirs de trajets.
// Place ton fichier réel dans `public/video/compil.mp4`.

interface MemoryVideoProps {
  /**
   * Texte alternatif pour les lecteurs d'écran.
   */
  alt?: string;
}

export function MemoryVideo({ alt }: MemoryVideoProps) {
  return (
    <div className="mt-5">
      <div className="overflow-hidden rounded-2xl shadow-lg shadow-red-200">
        <video
          className="h-auto w-full"
          src="/video/compil.mp4"
          autoPlay
          muted
          playsInline
          loop
          aria-label={alt ?? "Compilation vidéo de nos trajets ensemble"}
        />
      </div>
      <p className="mt-2 text-xs text-center text-[#661111]/80">
        Preuve vidéo officielle des raccompagnements premium.
      </p>
    </div>
  );
}

