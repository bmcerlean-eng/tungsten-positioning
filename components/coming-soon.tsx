"use client";

import Link from "next/link";
import Image from "next/image";
import { PILLARS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  pillarId: string;
}

export default function ComingSoon({ pillarId }: ComingSoonProps) {
  const pillar = PILLARS.find((p) => p.id === pillarId);

  if (!pillar) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-gray-500">Pillar not found.</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-full bg-gradient-to-br ${pillar.gradient} flex items-center justify-center px-6`}
    >
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Image
              src={pillar.icon}
              alt={`${pillar.title} icon`}
              width={40}
              height={40}
              className="brightness-0 invert opacity-90"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-white font-bold text-3xl tracking-tight mb-2">
          {pillar.title}
        </h1>
        <p className="text-white/70 text-base mb-8">{pillar.subtitle}</p>

        {/* Coming Soon badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-6 py-3 rounded-full mb-10">
          <span className="w-2 h-2 rounded-full bg-tungsten-gold animate-pulse" />
          Coming Soon
        </div>

        {/* Back link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
