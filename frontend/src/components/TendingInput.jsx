import { useState } from 'react';
import { Flame, Loader2, Wallet } from 'lucide-react';

const MAX_OFFERING = 400;
const MAX_ALIAS = 40;
const MIN_OFFERING = 3;

// The tending offering input: an alias and a written act of tending. Validates
// the offering length, counts characters, and prevents double submits while a
// tend is in flight.
export default function TendingInput({ connected, busy, onConnect, onSubmit }) {
  const [alias, setAlias] = useState('');
  const [offering, setOffering] = useState('');
  const [touched, setTouched] = useState(false);

  const trimmed = offering.trim();
  const tooShort = trimmed.length < MIN_OFFERING;
  const showError = touched && tooShort;

  const submit = () => {
    setTouched(true);
    if (tooShort || busy) return;
    onSubmit({ alias: alias.trim().slice(0, MAX_ALIAS) || 'Anonymous', offering: trimmed.slice(0, MAX_OFFERING) });
  };

  const count = offering.length;
  const nearLimit = count > MAX_OFFERING - 60;

  return (
    <div className="rounded-3xl border border-abyss-line/70 bg-abyss-raised/30 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Flame size={16} className="text-cyan" />
        <h2 className="font-display text-xl font-semibold text-glowtext">Offer an act of tending</h2>
      </div>
      <p className="mb-4 text-sm text-glowtext-dim">
        Write something for the flame in its current state. The warden judges it in context, then a
        deterministic backstop moves the one shared vitality.
      </p>

      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-glowtext-faint">
        Alias (optional)
      </label>
      <input
        type="text"
        value={alias}
        onChange={(e) => setAlias(e.target.value.slice(0, MAX_ALIAS))}
        placeholder="Anonymous"
        maxLength={MAX_ALIAS}
        aria-label="Your alias"
        className="mb-4 w-full rounded-xl border border-abyss-line bg-abyss-deep/60 px-3.5 py-2.5 text-sm text-glowtext outline-none transition focus:border-cyan/50"
      />

      <div className="mb-1.5 flex items-center justify-between">
        <label
          htmlFor="offering-text"
          className="text-xs font-medium uppercase tracking-wide text-glowtext-faint"
        >
          Your offering
        </label>
        <span className={`font-mono text-[11px] ${nearLimit ? 'text-rose' : 'text-glowtext-faint'}`}>
          {count} / {MAX_OFFERING}
        </span>
      </div>
      <textarea
        id="offering-text"
        value={offering}
        onChange={(e) => setOffering(e.target.value.slice(0, MAX_OFFERING))}
        onBlur={() => setTouched(true)}
        rows={4}
        placeholder="Tend the flame with care, steadiness, or something it needs now."
        aria-label="Your offering"
        aria-invalid={showError}
        className="w-full resize-none rounded-xl border border-abyss-line bg-abyss-deep/60 px-3.5 py-2.5 text-sm text-glowtext outline-none transition focus:border-cyan/50"
      />
      {showError && (
        <p className="mt-1.5 text-xs text-rose">An offering must be at least {MIN_OFFERING} characters.</p>
      )}

      <div className="mt-4">
        {connected ? (
          <button
            type="button"
            onClick={submit}
            disabled={busy || tooShort}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-abyss-deep transition hover:bg-cyan-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Tending in progress
              </>
            ) : (
              <>
                <Flame size={16} />
                Tend the flame
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-5 py-3 text-sm font-semibold text-cyan transition hover:bg-cyan/20"
          >
            <Wallet size={16} />
            Connect wallet to tend
          </button>
        )}
      </div>
    </div>
  );
}
