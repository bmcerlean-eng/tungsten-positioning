import { PILLARS } from "@/lib/constants";
import PillarTile from "@/components/pillar-tile";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center px-6 pt-4 pb-8 bg-tungsten-surface">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-tungsten-navy tracking-tight">
            AI Positioning
          </h1>
          <p className="mt-2 text-tungsten-muted text-sm max-w-lg mx-auto leading-relaxed">
            Select a pillar to generate tailored, account-specific sales
            positioning content powered by AI
          </p>
        </div>

        {/* 2x2 Pillar grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PILLARS.map((pillar, index) => (
            <PillarTile key={pillar.id} pillar={pillar} index={index} />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-tungsten-muted mt-8">
          Powered by Claude Opus 4.6 &middot; Proprietary and Confidential
        </p>
      </div>
    </div>
  );
}
