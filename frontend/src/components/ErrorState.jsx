import { Component } from 'react';
import { AlertTriangle, RotateCcw, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, addressUrl } from '../lib/contract.js';

// Inline error panel with retry + explorer link. The chrome around it always
// renders, so a failed read never blanks the screen.
export function ErrorPanel({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-rose/30 bg-rose/5 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose/40 bg-rose/10">
        <AlertTriangle size={22} className="text-rose" />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-glowtext">A read faltered</h3>
        <p className="mt-1 max-w-sm text-sm text-glowtext-dim">
          {message || 'The flame could not be read from the chain.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-abyss-deep transition hover:bg-cyan-soft"
          >
            <RotateCcw size={15} />
            Retry
          </button>
        )}
        <a
          href={addressUrl(CONTRACT_ADDRESS)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-abyss-line px-5 py-2.5 text-sm text-glowtext-dim transition hover:text-glowtext"
        >
          <ExternalLink size={15} />
          View contract
        </a>
      </div>
    </div>
  );
}

// Class error boundary so a render crash inside the altar does not blank the app.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('Vigil render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <ErrorPanel
            message="Something interrupted the vigil. Reload to rejoin the flame."
            onRetry={() => {
              this.setState({ hasError: false });
              if (typeof window !== 'undefined') window.location.reload();
            }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
