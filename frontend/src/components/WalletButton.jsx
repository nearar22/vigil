import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, Droplets, ExternalLink, AlertTriangle, Copy, Check } from 'lucide-react';
import { shortAddr } from '../lib/format.js';
import { FAUCET, NETWORK_NAME, addressUrl } from '../lib/contract.js';

export default function WalletButton({ wallet }) {
  const { address, onRightChain, connecting, connect, disconnect, switchChain, error } = wallet;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be blocked */
    }
  };

  if (!address) {
    return (
      <div className="flex flex-col items-end">
        <button
          type="button"
          onClick={connect}
          disabled={connecting}
          className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan transition hover:bg-cyan/20 disabled:opacity-60"
        >
          <Wallet size={16} />
          {connecting ? 'Connecting' : 'Connect wallet'}
        </button>
        {error && <span className="mt-1 text-xs text-rose">{error}</span>}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((vv) => !vv)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-abyss-line bg-abyss-raised/70 px-3 py-2 text-sm text-glowtext transition hover:border-cyan/40"
      >
        <span
          className={`h-2 w-2 rounded-full ${onRightChain ? 'bg-cyan' : 'bg-violet'}`}
          style={{ boxShadow: onRightChain ? '0 0 8px #37f0c8' : '0 0 8px #6a5cff' }}
        />
        <span className="font-mono">{shortAddr(address)}</span>
        <ChevronDown size={14} className="text-glowtext-faint" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-abyss-line bg-abyss-raised/95 p-2 shadow-drawer backdrop-blur"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="px-3 py-2">
                <p className="text-xs text-glowtext-faint">Connected to</p>
                <p className="text-sm font-medium text-glowtext">{NETWORK_NAME} testnet</p>
              </div>

              {!onRightChain && (
                <button
                  type="button"
                  onClick={() => {
                    switchChain();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-violet-soft transition hover:bg-violet/10"
                >
                  <AlertTriangle size={15} />
                  Switch to {NETWORK_NAME}
                </button>
              )}

              <div className="flex items-center justify-between gap-2 rounded-xl px-3 py-2">
                <span className="truncate font-mono text-xs text-glowtext-dim">{address}</span>
                <button
                  type="button"
                  onClick={copy}
                  aria-label="Copy address"
                  className="shrink-0 rounded-lg p-1.5 text-glowtext-faint transition hover:bg-white/5 hover:text-cyan"
                >
                  {copied ? <Check size={14} className="text-cyan" /> : <Copy size={14} />}
                </button>
              </div>

              <a
                href={addressUrl(address)}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-glowtext-dim transition hover:bg-white/5 hover:text-glowtext"
              >
                <ExternalLink size={15} />
                View on explorer
              </a>

              <a
                href={FAUCET}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-glowtext-dim transition hover:bg-white/5 hover:text-glowtext"
              >
                <Droplets size={15} />
                Open GenLayer Studio
              </a>

              <div className="my-1 h-px bg-abyss-line" />
              <button
                type="button"
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose transition hover:bg-rose/10"
              >
                <LogOut size={15} />
                Disconnect
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
