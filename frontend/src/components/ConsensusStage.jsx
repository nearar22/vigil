import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Eye } from 'lucide-react';
import { statusName } from '../lib/tx.js';

// The consensus moment, staged: the warden contemplates the offering while the
// flame waits. Surfaces the real on-chain transaction status name.
export default function ConsensusStage({ phase, liveStatus, alias, offering }) {
  const active = phase === 'wallet' || phase === 'contemplating';
  const label =
    phase === 'wallet'
      ? 'Awaiting your signature'
      : 'The warden contemplates the offering';

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-abyss-deep/70 px-6 text-center backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10"
            style={{ boxShadow: '0 0 40px rgba(55,240,200,0.4)' }}
          >
            <Eye size={26} className="text-cyan" />
          </motion.div>
          <h3 className="mt-5 font-display text-2xl font-semibold text-glowtext">{label}</h3>
          {offering && (
            <p className="mt-2 max-w-md text-sm italic text-glowtext-dim">
              {alias || 'Anonymous'} offers: "{offering}"
            </p>
          )}
          <p className="mt-3 max-w-sm text-xs text-glowtext-faint">
            An AI write can take one to five minutes. The flame waits while validators reach
            consensus. You can keep this open.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-abyss-line bg-abyss-raised/70 px-4 py-2">
            <Loader2 size={15} className="animate-spin text-cyan" />
            <span className="font-mono text-xs uppercase tracking-wide text-cyan-soft">
              {liveStatus ? statusName(liveStatus) : phase === 'wallet' ? 'SIGNING' : 'PENDING'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
