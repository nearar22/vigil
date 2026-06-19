import { Flame, Info } from 'lucide-react';
import WalletButton from './WalletButton.jsx';
import { NETWORK_NAME } from '../lib/contract.js';

export default function Header({ wallet, onAbout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-abyss-line/60 bg-abyss/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/10"
            style={{ boxShadow: '0 0 18px rgba(55,240,200,0.3)' }}
          >
            <Flame size={18} className="text-cyan" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold leading-none tracking-wide">Vigil</h1>
            <p className="text-[11px] text-glowtext-faint">the one shared living flame</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1.5 text-xs text-violet-soft sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" style={{ boxShadow: '0 0 8px #6a5cff' }} />
            {NETWORK_NAME} testnet
          </span>
          <button
            type="button"
            onClick={onAbout}
            className="hidden items-center gap-1.5 rounded-full border border-abyss-line px-3 py-2 text-sm text-glowtext-dim transition hover:text-glowtext sm:flex"
          >
            <Info size={15} />
            About
          </button>
          <WalletButton wallet={wallet} />
        </div>
      </div>
    </header>
  );
}
