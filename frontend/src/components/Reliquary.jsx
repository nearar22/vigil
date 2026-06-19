import { Archive, Skull } from 'lucide-react';
import { ordinal } from '../lib/format.js';
import Skeleton from './ui/Skeleton.jsx';

// The reliquary holds the epitaphs of past flames: eras that were sealed when
// the flame went out.
export default function Reliquary({ eras, loading }) {
  return (
    <div className="rounded-3xl border border-abyss-line/70 bg-abyss-raised/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Archive size={16} className="text-violet-soft" />
          <h2 className="font-display text-xl font-semibold text-glowtext">The reliquary</h2>
        </div>
        <span className="font-mono text-xs text-glowtext-faint">{eras.length}</span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-24 w-full" rounded="rounded-2xl" />
          ))}
        </div>
      ) : eras.length === 0 ? (
        <p className="py-6 text-center text-sm text-glowtext-dim">
          No flame has died yet. The first era still burns.
        </p>
      ) : (
        <ul className="thin-scroll flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
          {eras.map((e) => (
            <li
              key={e.era}
              className="rounded-2xl border border-violet/20 bg-violet/5 p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-glowtext">
                  The {ordinal(e.era)} flame
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-rose">
                  <Skull size={11} />
                  sealed
                </span>
              </div>
              <p className="mt-1 text-xs text-glowtext-faint">
                {e.tendings} tendings before it went out
              </p>
              {e.lastOffering && (
                <p className="mt-2 line-clamp-3 text-sm italic text-glowtext-dim">
                  Last offering by {e.lastAlias || 'Anonymous'}: "{e.lastOffering}"
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
