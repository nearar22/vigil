import { useCallback, useRef, useState } from 'react';
import {
  makeWalletClient,
  CONTRACT_ADDRESS,
  fetchStats,
  fetchFlame,
  fetchOfferings,
} from '../lib/contract.js';
import { pollUntilDecided } from '../lib/tx.js';

const INITIAL = { phase: 'idle', liveStatus: '', error: null, offering: null, flame: null, died: false };

function friendlyError(e) {
  const s = String(e);
  if (/user rejected|denied/i.test(s)) return 'You declined the signature request.';
  if (/LackOfFundForMaxFee|insufficient/i.test(s))
    return 'Wallet balance is below the write fee reserve. Claim test GEN and retry.';
  if (/rate limit|429/i.test(s)) return 'The network is busy. Wait a moment and retry.';
  return 'The offering could not be tended. Please retry.';
}

// tend is an AI write: the warden contemplates for 1 to 5 minutes. The SDK can
// throw on the receipt while the tx is live, so success is confirmed by the
// offerings count rising on chain rather than by the writeContract return.
export function useTend({ onConfirmed, pausePolling, resumePolling } = {}) {
  const [state, setState] = useState(INITIAL);
  const busy = useRef(false);

  const reset = useCallback(() => {
    busy.current = false;
    setState(INITIAL);
  }, []);

  const tend = useCallback(
    async (account, { alias, offering }) => {
      if (busy.current) return false;
      busy.current = true;
      pausePolling?.();
      setState({ ...INITIAL, phase: 'wallet' });

      let baseline = 0;
      try {
        baseline = (await fetchStats()).offerings;
      } catch {
        baseline = 0;
      }

      const client = makeWalletClient(account);
      let hash = null;
      try {
        hash = await client.writeContract({
          address: CONTRACT_ADDRESS,
          functionName: 'tend',
          args: [alias, offering],
          value: 0n,
        });
      } catch (e) {
        if (/user rejected|denied|LackOfFundForMaxFee|insufficient/i.test(String(e))) {
          setState((s) => ({ ...s, phase: 'error', error: friendlyError(e) }));
          busy.current = false;
          resumePolling?.();
          return false;
        }
        // Non-fatal: the tx may still be live, fall through to state polling.
      }

      setState((s) => ({ ...s, phase: 'contemplating' }));

      if (hash) {
        // Surface the real on-chain status name while the warden deliberates.
        pollUntilDecided(
          client,
          hash,
          (liveStatus) => setState((s) => ({ ...s, liveStatus })),
          { tries: 60, intervalMs: 6000 }
        ).catch(() => {});
      }

      // The AI write can take minutes; poll the shared state for up to ~6 min.
      for (let i = 0; i < 90; i++) {
        try {
          const stats = await fetchStats();
          if (stats.offerings > baseline) {
            const [flame, offs] = await Promise.all([fetchFlame(), fetchOfferings(20)]);
            const newest = offs[0] || null;
            const died = !!newest && newest.event === 'extinguished';
            setState((s) => ({
              ...s,
              phase: 'confirmed',
              offering: newest,
              flame,
              died,
            }));
            onConfirmed?.({ offering: newest, flame, died });
            busy.current = false;
            resumePolling?.();
            return true;
          }
        } catch {
          /* keep polling */
        }
        await new Promise((r) => setTimeout(r, 4000));
      }

      setState((s) => ({
        ...s,
        phase: 'error',
        error: 'The warden did not return a verdict in time. Your offering may still settle shortly.',
      }));
      busy.current = false;
      resumePolling?.();
      return false;
    },
    [onConfirmed, pausePolling, resumePolling]
  );

  return { state, tend, reset };
}
