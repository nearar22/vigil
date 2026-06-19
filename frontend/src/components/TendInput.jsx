import { useState } from 'react';
import { Flame, Loader2, Wallet } from 'lucide-react';
import { MAX_OFFERING, MAX_ALIAS } from '../lib/contract.js';
import ConfirmDialog from './ConfirmDialog.jsx';

const MIN_OFFERING = 3;

// The single tending input that sits below the flame: an alias and an offering.
// Validates the offering length, prevents double submits, and gates the write
// behind a confirmation dialog.
export default function TendInput({ wallet, busy, onTend }) {
  const [alias, setAlias] = useState('');
  const [offering, setOffering] = useState('');
  const [touched, setTouched] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const trimmed = offering.trim();
  const valid = trimmed.length >= MIN_OFFERING;
  const connected = !!wallet.address;
  const wrongChain = connected && !wallet.onRightChain;

  const overOffering = offering.length > MAX_OFFERING;
  const canSubmit = valid && !overOffering && !busy && connected && !wrongChain;

  const submit = () => {
    setTouched(true);
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const confirm = () => {
    setConfirmOpen(false);
    onTend({ alias: alias.trim().slice(0, MAX_ALIAS), offering: trimmed.slice(0, MAX_OFFERING) });
  };

  const clearAfterSend = () => {
    setOffering('');
    setTouched(false);
  };

  return (
    <div className="w-full">
      <div className="rounded-3xl border border-abyss-line/70 bg-abyss-raised/40 p-4 backdrop-blur sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="sm:w-44">
              <label htmlFor="tend-alias" className="sr-only">
                Your name
              </label>
              <input
                id="tend-alias"
                type="text"
                value={alias}
                maxLength={MAX_ALIAS}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full rounded-2xl border border-abyss-line bg-abyss/50 px-4 py-3 text-sm text-glowtext placeholder:text-glowtext-faint focus:border-biolum/50"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="tend-offering" className="sr-only">
                Your offering to the flame
              </label>
              <textarea
                id="tend-offering"
                rows={2}
                value={offering}
                onChange={(e) => setOffering(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Offer an act of tending to the shared flame"
                aria-invalid={touched && !valid}
                className="w-full resize-none rounded-2xl border border-abyss-line bg-abyss/50 px-4 py-3 text-sm text-glowtext placeholder:text-glowtext-faint focus:border-biolum/50"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs">
              {touched && !valid && (
                <span className="text-rose">An offering needs at least {MIN_OFFERING} characters.</span>
              )}
              {wrongChain && (
                <span className="text-rose">Switch to Bradbury testnet to tend.</span>
              )}
              {!connected && (
                <span className="text-glowtext-faint">Connect a wallet to tend the flame.</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-xs ${
                  overOffering ? 'text-rose' : 'text-glowtext-faint'
                }`}
              >
                {offering.length}/{MAX_OFFERING}
              </span>
              {connected ? (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="inline-flex items-center gap-2 rounded-full bg-biolum px-5 py-2.5 text-sm font-semibold text-abyss-deep transition hover:bg-biolum-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? <Loader2 size={15} className="animate-spin" /> : <Flame size={15} />}
                  {busy ? 'Tending' : 'Tend the flame'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={wallet.connect}
                  className="inline-flex items-center gap-2 rounded-full border border-biolum/40 bg-biolum/10 px-5 py-2.5 text-sm font-semibold text-biolum transition hover:bg-biolum/20"
                >
                  <Wallet size={15} />
                  Connect wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        alias={alias.trim()}
        offering={trimmed}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirm();
          clearAfterSend();
        }}
      />
    </div>
  );
}
