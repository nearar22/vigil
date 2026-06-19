import { Flame, ScrollText, Skull, Sparkles } from 'lucide-react';

// A quiet ribbon of on-chain stats. Deliberately understated so it never
// dominates the altar.
export default function StatsRibbon({ stats, loading }) {
  const items = [
    { icon: Sparkles, label: 'Era', value: stats.era },
    { icon: Flame, label: 'Tendings', value: stats.tendings },
    { icon: ScrollText, label: 'Offerings', value: stats.offerings },
    { icon: Skull, label: 'Flames lost', value: stats.deaths },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-abyss-line/50 bg-abyss-raised/20 px-5 py-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <it.icon size={13} className="text-glowtext-faint" />
          <span className="text-xs text-glowtext-faint">{it.label}</span>
          <span className="font-mono text-sm font-semibold text-glowtext font-numeric">
            {loading ? '-' : it.value}
          </span>
        </div>
      ))}
    </div>
  );
}
