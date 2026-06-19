import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertTriangle, ExternalLink, X, RotateCcw } from 'lucide-react';
import { txUrl } from '../lib/contract.js';

// Toast shapes:
//   { id, kind: 'loading'|'success'|'error', title, message, txHash, onRetry }
export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(380px,92vw)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="pointer-events-auto overflow-hidden rounded-2xl border border-abyss-line bg-abyss-raised/95 p-3.5 shadow-drawer backdrop-blur"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">
                {t.kind === 'loading' && <Loader2 size={18} className="animate-spin text-cyan" />}
                {t.kind === 'success' && <CheckCircle2 size={18} className="text-cyan" />}
                {t.kind === 'error' && <AlertTriangle size={18} className="text-rose" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-glowtext">{t.title}</p>
                {t.message && <p className="mt-0.5 text-xs text-glowtext-dim">{t.message}</p>}
                <div className="mt-1.5 flex items-center gap-3">
                  {t.txHash && (
                    <a
                      href={txUrl(t.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-cyan transition hover:text-cyan-soft"
                    >
                      <ExternalLink size={12} />
                      View transaction
                    </a>
                  )}
                  {t.onRetry && (
                    <button
                      type="button"
                      onClick={() => {
                        t.onRetry();
                        onDismiss(t.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-rose transition hover:text-rose-soft"
                    >
                      <RotateCcw size={12} />
                      Retry
                    </button>
                  )}
                </div>
              </div>
              {t.kind !== 'loading' && (
                <button
                  type="button"
                  onClick={() => onDismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 rounded-full p-1 text-glowtext-faint transition hover:bg-white/5 hover:text-glowtext"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
