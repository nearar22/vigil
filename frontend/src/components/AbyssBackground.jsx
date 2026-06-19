// A fixed, soft volumetric abyssal backdrop. Pure CSS gradients, no animation
// cost beyond a slow drift, and it sits behind everything.
export default function AbyssBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-abyss">
      <div
        className="absolute -left-1/4 top-0 h-[70vh] w-[70vw] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(55,240,200,0.10), transparent 70%)' }}
      />
      <div
        className="absolute -right-1/4 bottom-0 h-[70vh] w-[70vw] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(106,92,255,0.12), transparent 70%)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(8,19,32,0.0), rgba(1,4,10,0.9) 90%)',
        }}
      />
    </div>
  );
}
