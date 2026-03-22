"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PILLARS } from "@/lib/constants";

type Pillar = (typeof PILLARS)[number];

interface PillarTileProps {
  pillar: Pillar;
  index: number;
}

export default function PillarTile({ pillar, index }: PillarTileProps) {
  const delayMs = index * 120;

  const content = (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden min-h-[260px] flex flex-col",
        pillar.active
          ? "hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer group"
          : "cursor-default"
      )}
      style={{
        animation: `fadeSlideIn 0.5s ease-out ${delayMs}ms both`,
      }}
    >
      {/* Background image */}
      <Image
        src={pillar.image}
        alt={pillar.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Subtle hover brightening for active tiles */}
      {pillar.active && (
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
      )}

      {/* Content layer */}
      <div className="relative z-10 flex flex-col justify-end flex-1 p-8">
        {/* Pillar icon from website */}
        <div className="mb-3">
          <Image
            src={pillar.icon}
            alt={`${pillar.title} icon`}
            width={44}
            height={44}
            className="drop-shadow-lg brightness-0 invert opacity-80"
          />
        </div>

        {/* Text content — title + subtitle only */}
        <h2 className="text-white font-bold text-2xl tracking-tight drop-shadow-md">
          {pillar.title}
        </h2>
        <p className="text-white/90 text-sm font-medium drop-shadow-sm mt-1">
          {pillar.subtitle}
        </p>
      </div>

      {/* Coming Soon overlay for inactive pillars */}
      {!pillar.active && (
        <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
          <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/10">
            Coming Soon
          </span>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  if (pillar.active) {
    return <Link href={pillar.href}>{content}</Link>;
  }

  return content;
}
