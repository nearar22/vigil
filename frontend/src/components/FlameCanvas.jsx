import { useEffect, useRef } from 'react';

// A bioluminescent organism rendered on a canvas. Its radius, brightness, and
// color reflect the on-chain vitality: bright cyan-violet and breathing when
// high, dim and reddening toward death. dpr-aware, paused when the tab is
// hidden, and a calm static render under prefers-reduced-motion.
//
// reaction: 'flare' (nourish) brightens, 'gutter' (harm) dims, null is idle.

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Returns [r,g,b] for a given vitality 0..100. Rose near death, violet low,
// cyan high.
function colorForVitality(v) {
  const t = Math.max(0, Math.min(100, v)) / 100;
  if (t < 0.25) {
    const k = t / 0.25; // rose -> violet
    return [lerp(255, 106, k), lerp(122, 92, k), lerp(166, 255, k)];
  }
  const k = (t - 0.25) / 0.75; // violet -> cyan
  return [lerp(106, 55, k), lerp(92, 240, k), lerp(255, 200, k)];
}

export default function FlameCanvas({ vitality = 60, alive = true, reaction = null, reducedMotion = false }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const redrawRef = useRef(null);
  const stateRef = useRef({ vitality, reaction, reactionT: 0, motes: [], t: 0, visible: true });

  useEffect(() => {
    stateRef.current.vitality = vitality;
  }, [vitality]);

  useEffect(() => {
    if (reaction) {
      stateRef.current.reaction = reaction;
      stateRef.current.reactionT = 1;
    }
  }, [reaction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Seed drifting motes around the flame.
    const seedMotes = () => {
      const motes = [];
      const n = 38;
      for (let i = 0; i < n; i++) {
        motes.push({
          a: Math.random() * Math.PI * 2,
          r: 0.4 + Math.random() * 1.4,
          dist: 0.5 + Math.random() * 0.9,
          speed: 0.0006 + Math.random() * 0.0014,
          phase: Math.random() * Math.PI * 2,
        });
      }
      stateRef.current.motes = motes;
    };
    seedMotes();

    const onVisibility = () => {
      stateRef.current.visible = !document.hidden;
      if (stateRef.current.visible && !reducedMotion) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    function drawFrame(time) {
      const st = stateRef.current;
      const cx = W / 2;
      const cy = H / 2;
      const base = Math.min(W, H) * 0.5;
      const v = st.vitality;
      const vt = Math.max(0, Math.min(100, v)) / 100;

      // Reaction modulates brightness/size briefly.
      let reactBoost = 0;
      if (st.reactionT > 0) {
        const sign = st.reaction === 'gutter' ? -1 : 1;
        reactBoost = sign * st.reactionT * 0.35;
        st.reactionT = Math.max(0, st.reactionT - 0.012);
      }

      const breath = reducedMotion ? 0 : Math.sin(time * 0.0009) * 0.05;
      const flicker = reducedMotion ? 0 : Math.sin(time * 0.013) * 0.015 + Math.sin(time * 0.007) * 0.02;
      const coreScale = 0.32 + vt * 0.34 + breath + reactBoost * 0.4;
      const radius = base * Math.max(0.12, coreScale + flicker);

      const [r, g, b] = colorForVitality(v);
      const alphaBase = alive ? 0.55 + vt * 0.4 + reactBoost : 0.18;
      const alpha = Math.max(0.05, Math.min(1, alphaBase));

      ctx.clearRect(0, 0, W, H);

      // Deep ambient bloom.
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 1.3);
      bloom.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${alpha * 0.5})`);
      bloom.addColorStop(0.4, `rgba(${r | 0},${g | 0},${b | 0},${alpha * 0.16})`);
      bloom.addColorStop(1, 'rgba(3,7,15,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      // Drifting motes (organic particulate).
      if (!reducedMotion) {
        for (const m of st.motes) {
          m.a += m.speed;
          const orbit = radius * (1 + m.dist);
          const wob = Math.sin(time * 0.001 + m.phase) * 6;
          const mx = cx + Math.cos(m.a) * (orbit + wob);
          const my = cy + Math.sin(m.a) * (orbit + wob);
          const ma = (0.15 + 0.5 * Math.abs(Math.sin(time * 0.002 + m.phase))) * alpha;
          ctx.beginPath();
          ctx.arc(mx, my, m.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${ma})`;
          ctx.fill();
        }
      }

      // Outer glow ring.
      const ring = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      ring.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${alpha})`);
      ring.addColorStop(0.7, `rgba(${Math.min(255, r + 40) | 0},${g | 0},${Math.min(255, b + 30) | 0},${alpha * 0.5})`);
      ring.addColorStop(1, 'rgba(3,7,15,0)');
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Bright inner core.
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.5);
      core.addColorStop(0, `rgba(255,255,255,${Math.min(1, alpha + 0.2)})`);
      core.addColorStop(0.3, `rgba(${Math.min(255, r + 90) | 0},${Math.min(255, g + 30) | 0},${Math.min(255, b + 60) | 0},${alpha})`);
      core.addColorStop(1, `rgba(${r | 0},${g | 0},${b | 0},0)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw(time) {
      drawFrame(time);
      if (stateRef.current.visible && !reducedMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    if (reducedMotion) {
      // Single calm static render.
      drawFrame(1200);
      redrawRef.current = () => drawFrame(1200);
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      redrawRef.current = null;
    };
  }, [alive, reducedMotion]);

  // Redraw a static frame when vitality changes under reduced motion.
  useEffect(() => {
    if (!reducedMotion) return;
    redrawRef.current?.();
  }, [vitality, reaction, reducedMotion]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
