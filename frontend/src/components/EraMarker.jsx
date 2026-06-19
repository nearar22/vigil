import { Sparkles } from 'lucide-react';
import { ordinal } from '../lib/format.js';

// A small era marker that sits above the flame, naming which life this is.
export default function EraMarker({ era = 1, nourishStreak = 0 }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5">
        <Sparkles size={14} className="text-violet-soft" />
        <span className="font-display text-lg font-semibold tracking-wide text-glowtext">
          The {ordinal(era)} flame
        </span>
      </div>
      {nourishStreak > 0 && (
        <span className="font-mono text-[11px] uppercase tracking-wide text-cyan-soft">
          nourish streak {nourishStreak} / 5
        </span>
      )}
    </div>
  );
}
