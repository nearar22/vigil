import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

export const CONTRACT_ADDRESS = '0xC6321AF4A0B3d4a479c09cbD72D8aB6E9DBDDF84';
export const DEPLOY_TX = '0x5279b6eca95d3c39cad9777916621bd257494f10ed4221bf530644b639611119';
export const EXPLORER = 'https://explorer-studio.genlayer.com';
export const FAUCET = 'https://studio.genlayer.com/';
export const RPC_URL = 'https://studio.genlayer.com/api';
export const NETWORK_NAME = 'GenLayer Studio';
export const CHAIN_ID = 61999;
export const CHAIN_ID_HEX = '0x' + CHAIN_ID.toString(16);

export const addressUrl = (addr) => `${EXPLORER}/address/${addr}`;
export const txUrl = (hash) => `${EXPLORER}/tx/${hash}`;

// Vitality bands shape the flame's reading and color. Cyan-violet life when
// high, an amber wane in the middle, a warning rose only when near death.
export const MAX_VITALITY = 100;
export const BASE_VITALITY = 60;

export const VERDICTS = {
  nourish: { key: 'nourish', label: 'Nourished', color: '#37f0c8', glow: 'rgba(55, 240, 200, 0.55)' },
  pass: { key: 'pass', label: 'Passed', color: '#9c92ff', glow: 'rgba(156, 146, 255, 0.5)' },
  harm: { key: 'harm', label: 'Harmed', color: '#ff7aa6', glow: 'rgba(255, 122, 166, 0.5)' },
};

export const verdictOf = (v) => VERDICTS[String(v)] || VERDICTS.pass;

// A flame's life-stage from its vitality, used to drive color and copy.
export function flameStage(vitality) {
  const v = Number(vitality) || 0;
  if (v <= 0) return { key: 'out', label: 'Extinguished', color: '#ff7aa6' };
  if (v < 25) return { key: 'dying', label: 'Guttering', color: '#ff7aa6' };
  if (v < 55) return { key: 'low', label: 'Faltering', color: '#9c92ff' };
  if (v < 80) return { key: 'steady', label: 'Steady', color: '#7df7df' };
  return { key: 'radiant', label: 'Radiant', color: '#37f0c8' };
}

export const readClient = createClient({ chain: studionet });
export const makeWalletClient = (account, provider) => {
  const walletProvider = provider || (typeof window !== 'undefined' ? window.ethereum : null);
  if (!walletProvider) throw new Error('Browser wallet provider is unavailable.');
  return createClient({ chain: studionet, account, provider: walletProvider });
};

// Reads can hit transient RPC errors; retry with exponential backoff.
export async function withRpcRetry(fn, tries = 5) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch|ECONN|503|502|gateway/i.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 2000 * 2 ** i));
    }
  }
  throw last;
}

// ----- value coercion (the SDK can return Map / bigint shapes) -------------

function asNumber(v) {
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'number') return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function asString(v) {
  return v === undefined || v === null ? '' : String(v);
}
function asBool(v) {
  return v === true || v === 1 || v === 1n || v === 'true' || v === '1';
}
function pick(obj, key) {
  if (obj instanceof Map) return obj.get(key);
  if (obj && typeof obj === 'object') return obj[key];
  return undefined;
}
function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v instanceof Map) return Array.from(v.values());
  return [];
}

// ----- normalizers ---------------------------------------------------------

export function normFlame(raw) {
  return {
    era: asNumber(pick(raw, 'era')),
    vitality: asNumber(pick(raw, 'vitality')),
    status: asString(pick(raw, 'status')) || 'alight',
    nourishStreak: asNumber(pick(raw, 'nourishStreak')),
    lastNourisher: asString(pick(raw, 'lastNourisher')),
    lastKeeper: asString(pick(raw, 'lastKeeper')),
    tendings: asNumber(pick(raw, 'tendings')),
    bornAtOffering: asNumber(pick(raw, 'bornAtOffering')),
  };
}

export function normOffering(raw) {
  return {
    id: asString(pick(raw, 'id')),
    era: asNumber(pick(raw, 'era')),
    alias: asString(pick(raw, 'alias')),
    offering: asString(pick(raw, 'offering')),
    verdict: asString(pick(raw, 'verdict')) || 'pass',
    magnitude: asNumber(pick(raw, 'magnitude')),
    reply: asString(pick(raw, 'reply')),
    novel: asBool(pick(raw, 'novel')),
    similarTo: asString(pick(raw, 'similarTo')),
    vitalityBefore: asNumber(pick(raw, 'vitalityBefore')),
    vitalityAfter: asNumber(pick(raw, 'vitalityAfter')),
    delta: asNumber(pick(raw, 'delta')),
    effectiveNourish: asBool(pick(raw, 'effectiveNourish')),
    streakAdvanced: asBool(pick(raw, 'streakAdvanced')),
    event: asString(pick(raw, 'event')) || 'tended',
    by: asString(pick(raw, 'by')),
    seq: asNumber(pick(raw, 'seq')),
  };
}

export function normEra(raw) {
  return {
    era: asNumber(pick(raw, 'era')),
    tendings: asNumber(pick(raw, 'tendings')),
    lastAlias: asString(pick(raw, 'lastAlias')),
    lastOffering: asString(pick(raw, 'lastOffering')),
    diedAtOffering: asNumber(pick(raw, 'diedAtOffering')),
  };
}

export function normStats(raw) {
  return {
    era: asNumber(pick(raw, 'era')),
    vitality: asNumber(pick(raw, 'vitality')),
    tendings: asNumber(pick(raw, 'tendings')),
    offerings: asNumber(pick(raw, 'offerings')),
    deaths: asNumber(pick(raw, 'deaths')),
    keepers: asNumber(pick(raw, 'keepers')),
  };
}

export function normRoster(raw) {
  return {
    keepers: asArray(pick(raw, 'keepers')).map(asString),
    sealed: asBool(pick(raw, 'sealed')),
    lastKeeper: asString(pick(raw, 'lastKeeper')),
  };
}

// ----- view reads -----------------------------------------------------------

async function readView(functionName, args = []) {
  return withRpcRetry(() => readClient.readContract({ address: CONTRACT_ADDRESS, functionName, args }));
}

export async function fetchFlame() {
  return normFlame(await readView('get_flame'));
}

export async function fetchStats() {
  return normStats(await readView('get_stats'));
}

export async function fetchRoster() {
  return normRoster(await readView('get_roster'));
}

// Walk the paged view (PAGE = 20) until the chain returns a short page.
export async function fetchOfferings(limit = 60) {
  const out = [];
  let start = 0;
  for (let guard = 0; guard < 200; guard++) {
    const page = asArray(await readView('get_offerings', [start])).map(normOffering);
    out.push(...page);
    if (page.length < 20 || out.length >= limit) break;
    start += page.length;
  }
  return out.slice(0, limit);
}

export async function fetchEras(limit = 60) {
  const out = [];
  let start = 0;
  for (let guard = 0; guard < 200; guard++) {
    const page = asArray(await readView('get_eras', [start])).map(normEra);
    out.push(...page);
    if (page.length < 20 || out.length >= limit) break;
    start += page.length;
  }
  return out.slice(0, limit);
}
