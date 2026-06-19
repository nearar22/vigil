import { motion } from 'framer-motion';
import { flameStage, MAX_VITALITY } from '../lib/contract.js';

// A circular vitality meter that rings the flame. The arc fills with the one
// shared vitality and tints to the flame's life-stage color.
export default function VitalityHalo({ vitality = 0, size = 320, alive = true }) {
  const v = Math.max(0, Math.min(MAX_VITALITY, Number(vitality) || 0));
  const stage = flameStage(v);
  const stroke = 3;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const frac = v / MAX_VITALITY;
  const offset = c * (1 - frac);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      role="img"
      aria-label={`Flame vitality ${v} of 100, ${stage.label}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(16, 40, 59, 0.7)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={alive ? stage.color : '#ff7aa6'}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={false}
        animate={{ strokeDashoffset: offset }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 6px ${stage.color})` }}
      />
    </svg>
  );
}
