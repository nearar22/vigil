export function shortAddr(addr) {
  if (!addr) return '';
  const s = String(addr);
  if (s.length <= 12) return s;
  return `${s.slice(0, 6)}...${s.slice(-4)}`;
}

export function initials(name) {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || '').join('') || '?';
}

export function ordinal(n) {
  const v = Number(n) || 0;
  const s = ['th', 'st', 'nd', 'rd'];
  const k = v % 100;
  return v + (s[(k - 20) % 10] || s[k] || s[0]);
}
