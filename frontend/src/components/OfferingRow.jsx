import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, Sparkles, Skull } from 'lucide-react';
import { verdictOf } from '../lib/contract.js';
import { shortAddr } from '../lib/format.js';

function EventBadge({ event }) {
  if (event === 'ascended') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan">
        <Sparkles size={10} />
        Ascended
      </span>
    );
  }
  if (event === 'extinguished') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose/40 bg-rose/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose">
        <Skull size={10} />
        Extinguished
      </span>
    );
  }
  return null;
}

export default function OfferingRow({ offering, fresh }) {
  const meta = verdictOf(offering.verdict);
  const delta = offering.delta;
  const DeltaIcon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus;

  return (
    <motion.li
      layout
      initial={fresh ? { opacity: 0, y: -10, boxShadow: `0 0 0px ${meta.glow}` } : false}
      animate={
        fresh
          ? { opacity: 1, y: 0, boxShadow: [`0 0 24px ${meta.glow}`, '0 0 0px rgba(0,0,0,0)'] }
          : { opacity: 1, y: 0 }
      }
      transition={{ duration: fresh ? 1.4 : 0.3 }}
      className="rounded-2xl border border-abyss-line/70 bg-abyss-raised/30 p-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}
            >
              {meta.label}
            </span>
            <EventBadge event={offering.event} />
            <span className="font-mono text-[11px] text-glowtext-faint">era {offering.era}</span>
          </div>
          <p className="mt-2 truncate text-sm font-medium text-glowtext">{offering.alias}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <span
            className="inline-flex items-center gap-0.5 font-mono text-sm font-semibold"
            style={{ color: delta > 0 ? '#37f0c8' : delta < 0 ? '#ff7aa6' : '#9db8b3' }}
          >
            <DeltaIcon size={13} />
            {delta > 0 ? '+' : ''}
            {delta}
          </span>
          <span className="font-mono text-[10px] text-glowtext-faint">
            {offering.vitalityBefore} {'>'} {offering.vitalityAfter}
          </span>
        </div>
      </div>

      <p className="mt-2 line-clamp-3 text-sm italic text-glowtext-dim">"{offering.offering}"</p>

      {offering.reply && (
        <p className="mt-2 border-l-2 border-violet/40 pl-3 text-xs text-violet-soft">
          Warden: {offering.reply}
        </p>
      )}

      {offering.by && (
        <p className="mt-2 font-mono text-[10px] text-glowtext-faint">by {shortAddr(offering.by)}</p>
      )}
    </motion.li>
  );
}
