import { AnimatePresence } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import OfferingRow from './OfferingRow.jsx';
import Skeleton from './ui/Skeleton.jsx';

export default function OfferingLog({ offerings, loading, freshId }) {
  return (
    <div className="rounded-3xl border border-abyss-line/70 bg-abyss-raised/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText size={16} className="text-cyan" />
          <h2 className="font-display text-xl font-semibold text-glowtext">Recent offerings</h2>
        </div>
        <span className="font-mono text-xs text-glowtext-faint">{offerings.length}</span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full" rounded="rounded-2xl" />
          ))}
        </div>
      ) : offerings.length === 0 ? (
        <p className="py-8 text-center text-sm text-glowtext-dim">
          No one has tended the flame yet. Be the first to offer.
        </p>
      ) : (
        <ul className="thin-scroll flex max-h-[640px] flex-col gap-3 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {offerings.map((o) => (
              <OfferingRow key={o.id} offering={o} fresh={o.id === freshId} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
