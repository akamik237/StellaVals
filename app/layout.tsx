import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { FloatingHearts } from "@/components/FloatingHearts";
import BackgroundMusic from "@/components/BackgroundMusic";

// Police principale élégante et lisible pour mobile
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Police style CodePen pour le titre "Click Me"
const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saint-Valentin – Stella & Dimitri",
  description:
    "Mini site romantique interactif, conçu spécialement pour Oyono Jeanne Stella.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased text-[#330000] min-h-screen`}
      >
        <FloatingHearts />
        <BackgroundMusic />
        {/* Conteneur global pour garder le site centré sur mobile */}
        <div className="min-h-screen flex items-center justify-center px-4 py-6 overflow-visible">
          {children}
        </div>
      </body>
    </html>
  );
}
