import { AnimatePresence, motion } from 'framer-motion';
import { Flame, X } from 'lucide-react';

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Tend the flame',
  body,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="absolute inset-0 bg-abyss-deep/80 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-[min(440px,94vw)] rounded-3xl border border-cyan/25 bg-abyss-raised/95 p-6 shadow-bio"
          >
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded-full p-1.5 text-glowtext-faint transition hover:bg-white/5 hover:text-glowtext"
            >
              <X size={16} />
            </button>
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan/40 bg-cyan/10"
              style={{ boxShadow: '0 0 28px rgba(55,240,200,0.35)' }}
            >
              <Flame size={22} className="text-cyan" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-glowtext">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-glowtext-dim">
              {body ||
                'This submits a transaction on Bradbury Testnet. Network fees apply. Continue?'}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-full border border-abyss-line px-4 py-2.5 text-sm font-medium text-glowtext-dim transition hover:text-glowtext"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-full bg-cyan px-4 py-2.5 text-sm font-semibold text-abyss-deep transition hover:bg-cyan-soft"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
