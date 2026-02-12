"use client";

import { usePathname } from "next/navigation";

// Sur /message : pas de carré blanc, la carte prend toute la place.
// Autres pages : wrapper avec carte blanche (romantic-card).

export default function TemplateWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMessagePage = pathname === "/message";

  if (isMessagePage) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md romantic-card p-6 sm:p-8 animate-fade-up overflow-visible">
      {children}
    </div>
  );
}
