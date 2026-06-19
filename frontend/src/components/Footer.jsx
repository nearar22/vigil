import { ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, addressUrl, txUrl, NETWORK_NAME } from '../lib/contract.js';
import { shortAddr } from '../lib/format.js';

export default function Footer() {
  return (
    <footer className="border-t border-abyss-line/60 bg-abyss/40">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 py-6 text-xs text-glowtext-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="text-balance">
          Vigil is a single shared flame on GenLayer {NETWORK_NAME}. Everyone tends the same life. An
          AI warden judges each offering; a deterministic backstop owns the vitality.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={addressUrl(CONTRACT_ADDRESS)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-glowtext-dim transition hover:text-cyan"
          >
            <ExternalLink size={12} />
            Contract {shortAddr(CONTRACT_ADDRESS)}
          </a>
          <a
            href={txUrl(DEPLOY_TX)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-glowtext-dim transition hover:text-cyan"
          >
            <ExternalLink size={12} />
            Deploy tx {shortAddr(DEPLOY_TX)}
          </a>
        </div>
      </div>
    </footer>
  );
}
