import { AnimatePresence, motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import FlameCanvas from './FlameCanvas.jsx';
import VitalityHalo from './VitalityHalo.jsx';
import EraMarker from './EraMarker.jsx';
import ConsensusStage from './ConsensusStage.jsx';
import Skeleton from './ui/Skeleton.jsx';
import { flameStage } from '../lib/contract.js';

// The altar centers the entire screen on the one living flame. Vitality drives
// the canvas organism and the halo; the consensus stage and era transition play
// over it.
export default function FlameAltar({
  flame,
  loading,
  reaction,
  reducedMotion,
  tendPhase,
  liveStatus,
  pending,
  eraTransition,
}) {
  const vitality = flame ? flame.vitality : 0;
  const alive = flame ? flame.status === 'alight' && vitality > 0 : true;
  const stage = flameStage(vitality);

  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-abyss-line/70 bg-abyss-deep/40 px-4 py-10 lg:min-h-[calc(100vh-180px)]">
      {/* Era marker */}
      <div className="relative z-10 mb-4">
        {loading ? (
          <Skeleton className="h-9 w-44" rounded="rounded-full" />
        ) : (
          <EraMarker era={flame?.era || 1} nourishStreak={flame?.nourishStreak || 0} />
        )}
      </div>

      {/* The flame organism + halo */}
      <div className="relative flex aspect-square w-[min(70vw,460px)] items-center justify-center">
        <FlameCanvas
          vitality={vitality}
          alive={alive}
          reaction={reaction}
          reducedMotion={reducedMotion}
        />
        <div className="absolute inset-0">
          <VitalityHalo vitality={vitality} size={460} alive={alive} />
        </div>

        {/* Centered vitality readout */}
        <div className="relative z-10 flex flex-col items-center">
          {loading ? (
            <Skeleton className="h-16 w-28" />
          ) : (
            <>
              <span
                className="font-display text-7xl font-semibold leading-none font-numeric"
                style={{ color: stage.color, textShadow: `0 0 30px ${stage.color}` }}
              >
                {vitality}
              </span>
              <span className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-glowtext-dim">
                {stage.label}
              </span>
            </>
          )}
        </div>

        <ConsensusStage
          phase={tendPhase}
          liveStatus={liveStatus}
          alias={pending?.alias}
          offering={pending?.offering}
        />
      </div>

      {/* Era transition: extinguish then rekindle */}
      <AnimatePresence>
        {eraTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-abyss-deep/85 px-6 text-center backdrop-blur"
          >
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: [1, 1.3, 0.2, 0.6], opacity: [1, 0.8, 0, 1] }}
              transition={{ duration: 2.4, times: [0, 0.3, 0.55, 1] }}
              className="flex h-20 w-20 items-center justify-center rounded-full border border-rose/40 bg-rose/10"
              style={{ boxShadow: '0 0 50px rgba(255,122,166,0.5)' }}
            >
              <Flame size={32} className="text-rose" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-md"
            >
              <h3 className="font-display text-3xl font-semibold text-glowtext">
                The {ordinalLabel(eraTransition.era)} flame went out
              </h3>
              <p className="mt-2 text-sm text-glowtext-dim">{eraTransition.epitaph}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-cyan-soft">
                A new flame kindles in era {eraTransition.era + 1}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ordinalLabel(n) {
  const v = Number(n) || 0;
  const s = ['th', 'st', 'nd', 'rd'];
  const k = v % 100;
  return v + (s[(k - 20) % 10] || s[k] || s[0]);
}
