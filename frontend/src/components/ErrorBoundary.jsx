import { Component } from 'react';
import { AlertTriangle, RotateCw, ExternalLink } from 'lucide-react';
import { addressUrl, CONTRACT_ADDRESS } from '../lib/contract.js';

// Catches render-time crashes so the app never shows a blank screen. The header
// and footer chrome are rendered by App around this boundary's children, but
// this fallback still offers a recovery path and a link to the contract.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep a console trace for debugging; do not crash further.
    // eslint-disable-next-line no-console
    console.error('Vigil render error', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose/40 bg-rose/10">
            <AlertTriangle size={22} className="text-rose" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl text-glowtext">The altar flickered</h2>
          <p className="text-sm text-glowtext-dim">
            Something interrupted the view. The flame still burns on chain. You can retry, or open
            the contract directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 rounded-full bg-biolum px-5 py-2.5 text-sm font-semibold text-abyss-deep transition hover:bg-biolum-soft"
            >
              <RotateCw size={15} />
              Retry
            </button>
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
    return this.props.children;
  }
}
