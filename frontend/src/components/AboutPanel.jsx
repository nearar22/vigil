import { AnimatePresence, motion } from 'framer-motion';
import { X, Flame, Eye, Scale, Droplets, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, FAUCET, addressUrl, txUrl, NETWORK_NAME } from '../lib/contract.js';
import { shortAddr } from '../lib/format.js';

const steps = [
  {
    icon: Flame,
    title: 'One shared flame',
    body: 'There is exactly one flame, with a vitality from 0 to 100 and an era. A sealed roster of known keepers tends the same life.',
  },
  {
    icon: Eye,
    title: 'The warden judges',
    body: 'An AI warden checks semantic novelty, then rules each offering nourish, pass, or harm in the context of the current flame and recent tending.',
  },
  {
    icon: Scale,
    title: 'A deterministic backstop',
    body: 'Code owns the state: nourish raises vitality, harm lowers it, a fixed decay always bites. At zero the flame dies, its era is sealed, and a new flame kindles at 60.',
  },
];

export default function AboutPanel({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="About Vigil"
        >
          <div className="absolute inset-0 bg-abyss-deep/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="thin-scroll relative max-h-[88vh] w-[min(560px,95vw)] overflow-y-auto rounded-3xl border border-cyan/20 bg-abyss-raised/95 p-7 shadow-bio"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close about panel"
              className="absolute right-4 top-4 rounded-full p-1.5 text-glowtext-faint transition hover:bg-white/5 hover:text-glowtext"
            >
              <X size={18} />
            </button>

            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan/40 bg-cyan/10"
              style={{ boxShadow: '0 0 28px rgba(55,240,200,0.35)' }}
            >
              <Flame size={22} className="text-cyan" />
            </div>
            <h2 className="font-display text-3xl font-semibold text-glowtext">About Vigil</h2>
            <p className="mt-2 text-sm leading-relaxed text-glowtext-dim">
              Vigil is an on-chain single shared living flame tended by a sealed roster of known keepers. It is a
              GenLayer intelligent contract: an AI warden judges every act of tending, and a
              deterministic backstop owns the one shared vitality.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {steps.map((s) => (
                <div key={s.title} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-abyss-line bg-abyss-deep/60">
                    <s.icon size={16} className="text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-glowtext">{s.title}</h3>
                    <p className="text-sm text-glowtext-dim">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-abyss-line bg-abyss-deep/50 p-4">
              <p className="text-xs uppercase tracking-wide text-glowtext-faint">On {NETWORK_NAME} testnet</p>
              <div className="mt-2 flex flex-col gap-2">
                <a
                  href={addressUrl(CONTRACT_ADDRESS)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-glowtext-dim transition hover:text-cyan"
                >
                  <ExternalLink size={12} />
                  Contract {shortAddr(CONTRACT_ADDRESS)}
                </a>
                <a
                  href={txUrl(DEPLOY_TX)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-glowtext-dim transition hover:text-cyan"
                >
                  <ExternalLink size={12} />
                  Deploy tx {shortAddr(DEPLOY_TX)}
                </a>
                <a
                  href={FAUCET}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-glowtext-dim transition hover:text-cyan"
                >
                  <Droplets size={12} />
                  Open GenLayer Studio
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
