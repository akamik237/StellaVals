// Composant décoratif : petits cœurs flottants en arrière-plan.
// Aucun état, simplement du style + animation CSS légère.

const HEARTS = [
  { left: "5%", duration: "12s", delay: "0s", size: "text-xl" },
  { left: "18%", duration: "10s", delay: "1s", size: "text-2xl" },
  { left: "32%", duration: "14s", delay: "0.5s", size: "text-lg" },
  { left: "46%", duration: "11s", delay: "2s", size: "text-2xl" },
  { left: "60%", duration: "13s", delay: "1.2s", size: "text-xl" },
  { left: "74%", duration: "9s", delay: "0.8s", size: "text-lg" },
  { left: "88%", duration: "15s", delay: "1.6s", size: "text-2xl" },
];

export function FloatingHearts() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {HEARTS.map((heart, index) => (
        <span
          key={index}
          className={`absolute top-full ${heart.size} text-[#ff8080]/70 animate-float`}
          style={{
            left: heart.left,
            animationDuration: heart.duration,
            animationDelay: heart.delay,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}

