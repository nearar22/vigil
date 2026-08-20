import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AbyssBackground from './components/AbyssBackground.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FlameAltar from './components/FlameAltar.jsx';
import TendingInput from './components/TendingInput.jsx';
import OfferingLog from './components/OfferingLog.jsx';
import Reliquary from './components/Reliquary.jsx';
import StatsRibbon from './components/StatsRibbon.jsx';
import AboutPanel from './components/AboutPanel.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import ToastStack from './components/Toast.jsx';
import { ErrorPanel, ErrorBoundary } from './components/ErrorState.jsx';
import { useWallet } from './hooks/useWallet.js';
import { useVigil } from './hooks/useVigil.js';
import { useTend } from './hooks/useTend.js';
import { useToasts } from './hooks/useToasts.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import { verdictOf } from './lib/contract.js';

export default function App() {
  const wallet = useWallet();
  const reducedMotion = useReducedMotion();
  const { flame, offerings, eras, stats, loading, error, refresh, pausePolling, resumePolling } =
    useVigil();
  const { toasts, push, dismiss } = useToasts();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(null); // { alias, offering }
  const [reaction, setReaction] = useState(null);
  const [freshId, setFreshId] = useState(null);
  const [eraTransition, setEraTransition] = useState(null);
  const loadingToastId = useRef(null);

  const onConfirmed = useCallback(
    ({ offering, flame: newFlame, died }) => {
      refresh();
      if (!offering) return;
      const meta = verdictOf(offering.verdict);

      // The flame reacts: flare on nourish, gutter on harm.
      if (offering.verdict === 'harm') setReaction('gutter');
      else if (offering.verdict === 'nourish') setReaction('flare');
      else setReaction('pulse');
      setTimeout(() => setReaction(null), 2600);

      setFreshId(offering.id);
      setTimeout(() => setFreshId(null), 2000);

      if (loadingToastId.current) {
        dismiss(loadingToastId.current);
        loadingToastId.current = null;
      }

      if (died) {
        // Play the extinguish-then-rekindle sequence with the sealed epitaph.
        const diedEra = offering.era;
        setEraTransition({
          era: diedEra,
          epitaph: `Sealed after ${stats.tendings + 1} tendings. Last offering by ${
            offering.alias || 'Anonymous'
          }.`,
        });
        setTimeout(() => setEraTransition(null), 5200);
        push({
          kind: 'success',
          title: 'The flame went out',
          message: `Era ${diedEra} is sealed in the reliquary. A new flame kindles in era ${diedEra + 1}.`,
        });
      } else if (offering.event === 'ascended') {
        push({
          kind: 'success',
          title: 'The flame ascended',
          message: `Sustained nourishment carried it to era ${newFlame?.era}. Verdict: ${meta.label}.`,
        });
      } else {
        push({
          kind: 'success',
          title: `Offering ${meta.label.toLowerCase()}`,
          message: `${meta.label} by the warden. Vitality ${offering.vitalityBefore} to ${offering.vitalityAfter}.`,
        });
      }
    },
    [dismiss, push, refresh, stats.tendings]
  );

  const { state: tendState, tend, reset } = useTend({ onConfirmed, pausePolling, resumePolling });

  // Surface the loading toast while a tend is in flight.
  useEffect(() => {
    if (tendState.phase === 'contemplating' && !loadingToastId.current) {
      loadingToastId.current = push({
        kind: 'loading',
        title: 'The warden contemplates',
        message: 'An AI write can take one to five minutes. The flame waits.',
      });
    }
  }, [tendState.phase, push]);

  useEffect(() => {
    if (tendState.phase === 'error') {
      if (loadingToastId.current) {
        dismiss(loadingToastId.current);
        loadingToastId.current = null;
      }
      push({
        kind: 'error',
        title: 'Tending failed',
        message: tendState.error,
        onRetry: pending ? () => doTend(pending) : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tendState.phase]);

  const requestTend = useCallback((payload) => {
    setPending(payload);
    setConfirmOpen(true);
  }, []);

  const doTend = useCallback(
    async (payload) => {
      if (!wallet.address) return;
      reset();
      await tend(wallet.address, payload);
    },
    [reset, tend, wallet.address]
  );

  const confirmTend = useCallback(() => {
    setConfirmOpen(false);
    if (pending) doTend(pending);
  }, [doTend, pending]);

  const busy = tendState.phase === 'wallet' || tendState.phase === 'contemplating';

  const connected = !!wallet.address;
  const altarFlame = useMemo(() => flame, [flame]);

  return (
    <div className="relative flex min-h-screen flex-col text-glowtext">
      <AbyssBackground />
      <Header wallet={wallet} onAbout={() => setAboutOpen(true)} />

      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 sm:px-6">
        <ErrorBoundary>
          {error && !flame ? (
            <div className="py-10">
              <ErrorPanel message={error} onRetry={refresh} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(360px,420px)]">
              {/* The altar: the living flame at the center of everything */}
              <section className="flex flex-col gap-4">
                <FlameAltar
                  flame={altarFlame}
                  loading={loading && !flame}
                  reaction={reaction}
                  reducedMotion={reducedMotion}
                  tendPhase={tendState.phase}
                  liveStatus={tendState.liveStatus}
                  pending={pending}
                  eraTransition={eraTransition}
                />
                <StatsRibbon stats={stats} loading={loading && !flame} />
                {error && flame && (
                  <p className="rounded-full border border-rose/30 bg-rose/5 px-4 py-2 text-center text-xs text-rose-soft">
                    {error}
                  </p>
                )}
              </section>

              {/* The side rail: tend, offerings, reliquary */}
              <aside className="flex flex-col gap-6">
                <TendingInput
                  connected={connected}
                  busy={busy}
                  onConnect={wallet.connect}
                  onSubmit={requestTend}
                />
                <OfferingLog offerings={offerings} loading={loading && !flame} freshId={freshId} />
                <Reliquary eras={eras} loading={loading && !flame} />
              </aside>
            </div>
          )}
        </ErrorBoundary>
      </main>

      <Footer />

      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={confirmTend}
        onCancel={() => setConfirmOpen(false)}
        title="Tend the flame"
        body="This submits a gasless transaction on GenLayer Studio. The AI warden may take one to five minutes to judge your offering. Continue?"
        confirmLabel="Tend the flame"
      />
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
