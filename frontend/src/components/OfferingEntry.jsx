import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, Sparkles, Flame } from 'lucide-react';
import { verdictOf } from '../lib/contract.js';
import { shortAddr, eventLabel } from '../lib/format.js';

// A single tending in the log. Shows who tended, what they offered, the
// warden's verdict and reply, and how the one shared vitality moved.
export default function OfferingEntry({ offering }) {
  const meta = verdictOf(offering.verdict);
  const delta = offering.delta;
  const ascended = offering.event === 'ascended';
  const extinguished = offering.event === 'extinguished';

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl border border-abyss-line/60 bg-abyss-raised/30 p-4"
      style={{ borderColor: `${meta.color}33` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ color: meta.color, backgroundColor: `${meta.color}1a` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
            {meta.label}
          </span>
          <span className="truncate text-sm font-medium text-glowtext">{offering.alias}</span>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-glowtext-faint">
          Era {offering.era}
        </span>
      </div>

      <p className="mt-2 text-sm text-glowtext-dim">{offering.offering}</p>

      {offering.reply && (
        <p className="mt-2 border-l-2 pl-3 font-display text-sm italic text-glowtext" style={{ borderColor: meta.color }}>
          {offering.reply}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-glowtext-faint">
        <span className="inline-flex items-center gap-1 font-mono">
          {delta > 0 ? (
            <ArrowUp size={12} className="text-biolum" />
          ) : delta < 0 ? (
            <ArrowDown size={12} className="text-rose" />
          ) : (
            <Minus size={12} />
          )}
          <span style={{ color: delta > 0 ? '#37f0c8' : delta < 0 ? '#ff7aa6' : undefined }}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        </span>
        <span className="font-mono">
          {offering.vitalityBefore} {'\u2192'} {offering.vitalityAfter}
        </span>
        {ascended && (
          <span className="inline-flex items-center gap-1 text-violet-soft">
            <Sparkles size={12} />
            {eventLabel(offering.event)}
          </span>
        )}
        {extinguished && (
          <span className="inline-flex items-center gap-1 text-rose">
            <Flame size={12} />
            {eventLabel(offering.event)}
          </span>
        )}
        {offering.by && (
          <span className="ml-auto inline-flex items-center gap-1 font-mono">
            {shortAddr(offering.by)}
          </span>
        )}
      </div>
    </motion.li>
  );
}
